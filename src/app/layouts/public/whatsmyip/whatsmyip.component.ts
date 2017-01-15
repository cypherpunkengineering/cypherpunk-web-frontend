import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { isBrowser } from 'angular2-universal';
import country_list from '../pricing/countries';
import * as platform from 'platform';

@Component({
  templateUrl: './whatsmyip.component.html',
  styleUrls: ['./whatsmyip.component.css']
})
export class WhatsMyIpComponent {
  os: string;
  ip: string;
  browser: string;
  country: string;
  countryCode: string;

  constructor(private http: Http) {
    // detect os setup
    this.os = platform.os;
    this.browser = platform.description;

    // detect Geo-IP & country
    if (isBrowser) {
      let url = '/api/v0/network/status';
      http.get(url)
      .map(res => res.json())
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
      });
    }
  }

}
