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
  loading: boolean = true;
  totalServers: number = 0;

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
}
