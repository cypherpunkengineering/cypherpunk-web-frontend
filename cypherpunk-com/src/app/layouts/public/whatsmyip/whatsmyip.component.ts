import * as platform from 'platform';
import country_list from '../pricing/countries';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { BackendService } from '../../../services/backend.service';

@Component({
  templateUrl: './whatsmyip.component.html',
  styleUrls: ['./whatsmyip.component.css']
})
export class WhatsMyIpComponent {
  os: string;
  ip = 'Loading';
  browser: string;
  country = 'Loading';
  countryCode: string = undefined;

  constructor(
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // handle title
    this.document.title = 'What\'s My IP Address?';

    // detect os setup
    this.os = platform.os;
    this.browser = platform.description;

    // detect Geo-IP & country
    if (isPlatformBrowser(this.platformId)) {
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
