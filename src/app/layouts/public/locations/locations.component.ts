import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  regionArray = [];
  totalServers: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data: any) => {
        // parse data
        let locations = data.locations[0];
        let regions = data.locations[1];

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
      },
      (error: any) => { console.log(error); }
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
