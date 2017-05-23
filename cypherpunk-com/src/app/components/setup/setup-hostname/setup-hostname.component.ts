import { Observable } from 'rxjs/Rx';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-setup-hostname',
  templateUrl: './setup-hostname.component.html',
  styleUrls: ['./setup-hostname.component.css']
})
export class SetupHostnameComponent implements OnInit {
  user: any;
  regionArray = [];
  freeAccount: boolean = false;
  @Input() location: { hostname: '', display: false };
  @Output() update: EventEmitter<null> = new EventEmitter<null>();

  constructor(
    private session: SessionService,
    private backend: BackendService
  ) {
    // set user
    this.user = session.user;
    this.freeAccount = this.user.account.type === 'free' || !this.user.account.type;
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
          let region = this.findRegion(location.region);
          if (location.default && location.ovDefault.length) {
            this.location.hostname = location.ipsecHostname;
          }
          else if (location.default && !location.ovDefault.length) {
            let secondary = locations['newjersey'];
            this.location.hostname = secondary.ipsecHostname;
          }
          region.countries.push(location);
        });

        // sort each region's countries
        this.regionArray.forEach((region) => {
          region.countries.sort(this.regionSort);
        });

        this.update.emit();
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

  updateValue() { this.update.emit(); }

}
