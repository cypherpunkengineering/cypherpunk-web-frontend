import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/forkJoin';

@Component({
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  regionArray = [];
  loading: boolean = true;
  totalServers: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: Http
  ) { }

  ngOnInit() {
    let locationsUrl = '/api/v0/location/list/premium';
    let regionsUrl = '/api/v0/location/world';

    let locationsObs = this.http.get(locationsUrl).map(res => res.json());
    let regionsObs = this.http.get(regionsUrl).map(res => res.json());

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
