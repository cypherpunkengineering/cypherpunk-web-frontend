import { Observable } from 'rxjs/Rx';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import 'rxjs/add/observable/forkJoin';

@Component({
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  regionArray = [];
  locationArray = [];
  loading: boolean = true;
  totalServers: number = 0;

  // Map Stuff
  pi = Math.PI;
  halfPi = this.pi / 2;
  epsilon = Number.EPSILON;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.document.title = 'Cypherpunk Privacy VPN Network';
  }

  ngOnInit() {
    let locationsObs = this.backend.locations();
    let regionsObs = this.backend.regions();

    return Observable.forkJoin([locationsObs, regionsObs])
    .subscribe((data: any) => {
        // parse data
        let locations = data[0];
        let regions = data[1];

        console.log(locations);

        // create regionsArray
        regions.regionOrder.forEach((regionId) => {
          if (regionId !== 'DEV') {
            this.regionArray.push({
              id: regionId,
              name: regions.region[regionId],
              countries: []
            });
          }
        });

        // drop each location into their region
        let locArray = Object.keys(locations);
        locArray.forEach((key) => {
          let location = locations[key];
          this.totalServers += location.servers;
          let region = this.findRegion(location.region);
          region.countries.push(location);
        });

        // sort each region's countries
        this.regionArray.forEach((region) => {
          region.countries.sort(this.regionSort);
        });

        console.log(this.regionArray);
        this.regionArray.forEach((region) => {
          region.countries.forEach((location) => {
            this.locationArray.push(location);
          });
        });

        this.translateLocations(this.locationArray);
        console.log(this.locationArray);

        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  findRegion(regionId): any {
    let region;
    this.regionArray.map((thisRegion) => {
      if (thisRegion.id === regionId) { region = thisRegion; }
    });
    return region;
  }

  regionSort(a, b): number {
    let value = 0;
    if (a.country > b.country) { value = 1; }
    else if (a.country < b.country) { value = -1; }
    else if (a.country === b.country && a.name > b.name) { value = 1; }
    else if (a.country === b.country && a.name < b.name) { value = -1; }
    return value;
  }

  vanDerGrinten3Raw(lambda, phi) {
    if (Math.abs(phi) < this.epsilon) { return [lambda, 0]; }

    let sinTheta = phi / this.halfPi;
    let theta = Math.asin(sinTheta);

    if (Math.abs(lambda) < this.epsilon || Math.abs(Math.abs(phi) - this.halfPi) < this.epsilon) {
      return [0, this.pi * Math.tan(theta / 2)];
    }

    let A = (this.pi / lambda - lambda / this.pi) / 2;
    let y1 = sinTheta / (1 + Math.cos(theta));

    return [
      this.pi * (Math.sign(lambda) * Math.sqrt(A * A + 1 - y1 * y1) - A),
      this.pi * y1
    ];
  }

  transformToXY(lat, long) {
    let coords = this.vanDerGrinten3Raw((long - 11) * this.pi / 180, lat * this.pi / 180);
    coords[0] = (coords[0] * 150 + (920 / 2)) * (1000 / 920);
    coords[1] = (coords[1] * 150 + (500 / 2 + 500 * 0.15)) * (1000 / 920);
    return coords;
  }

  translateLocations(servers) {
    servers.forEach((server) => {
      if (!server.lat || !server.lon) { return; }
      let [ x, y ] = this.transformToXY(server.lat, server.lon);
      server.mapX = x;
      server.mapY = y;
      server.scale = server.scale || 1;
    });
    return servers;
  }
}
