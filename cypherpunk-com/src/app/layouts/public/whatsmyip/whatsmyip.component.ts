import * as platform from 'platform';
import { isBrowser } from 'angular2-universal';
import country_list from '../pricing/countries';
import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { BackendService } from '../../../services/backend.service';

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

  constructor(
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) {
    // handle title
    this.document.title = 'What\'s My IP Address?';

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
