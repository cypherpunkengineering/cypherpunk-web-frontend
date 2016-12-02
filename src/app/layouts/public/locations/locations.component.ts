import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  regions = {
    NA: { countries : [] },
    SA: { countries: [] },
    CR: { countries: [] },
    OP: { countries: [] },
    EU: { countries: [] },
    ME: { countries: [] },
    AF: { countries: [] },
    AS: { countries: [] },
    US: { countries: [] }
  };

  naRegionLength = 15;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data: any) => {
        let locations = data.locations;

        // drop each location into their region
        let locArray = Object.keys(locations);
        locArray.forEach((key) => {
          let location = locations[key];
          if (location.country === 'US') {
            this.regions.US.countries.push(location);
          }
          else {
            this.regions[location.region].countries.push(location);
          }
        });

        // sort each region
        let regionKeys = Object.keys(this.regions);
        regionKeys.map((regionKey) => {
          this.regions[regionKey].countries.sort(this.regionSort);
        });

        // put US at top of NA region
        let us = this.regions.US.countries;
        let na = this.regions.NA.countries;
        this.regions.NA.countries = us.concat(na);
      },
      (error: any) => { console.log(error); }
    );
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
