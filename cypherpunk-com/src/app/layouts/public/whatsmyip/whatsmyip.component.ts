import * as platform from 'platform';
import country_list from '../pricing/countries';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { SeoService } from '../../../services/seo.service';
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
    private seo: SeoService,
    private backend: BackendService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    seo.updateMeta({
      title: 'What\'s My IP Address?',
      description: 'See your current IP address and other information about you that other people can see, plus tips on how to hide that information.',
      url: '/whats-my-ip-address'
    });

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
