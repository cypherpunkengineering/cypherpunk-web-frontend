import { Component } from '@angular/core';
import { isBrowser } from 'angular2-universal';
import { BackendService } from '../../../services/backend.service';
import * as platform from 'platform';
import country_list from '../pricing/countries';

@Component({
  templateUrl: './whatsmyip.component.html',
  styleUrls: ['./whatsmyip.component.css']
})
export class WhatsMyIpComponent {
  os: string;
  ip: string = 'Loading';
  browser: string;
  country: string = 'Loading';
  countryCode: string = undefined;

  constructor(private backend: BackendService) {
    // detect os setup
    this.os = platform.os;
    this.browser = platform.description;

    // detect Geo-IP & country
    if (isBrowser) {
      this.backend.networkStatus()
      .subscribe((data: any) => {
        this.ip = data.ip;
        this.countryCode = data.country;

        if (data.country === 'ZZ') {
          this.country = 'Unknown';
          this.countryCode = undefined;
        }
        else {
          country_list.map((country) => {
            if (country.code === data.country) {
              this.country = country.name;
            }
          });
        }
      },
      (err) => {
        this.country = 'Unknown';
        this.ip = 'Unknown';
        this.countryCode = 'Unknown';
      });
    }
  }

}
