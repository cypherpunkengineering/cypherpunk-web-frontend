import { Injectable } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class GlobalsService {
  ENV = 'DEV';
  API_VERSION = 'v1';
  BACKEND_HOST = 'http://localhost:3000';
  API_URL = 'http://localhost:3000/api/' + this.API_VERSION;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    let browser_env = isPlatformBrowser(platformId);

    // Detect Environment
    if (browser_env) {
      let hostname = document.location.hostname;
      if (hostname.startsWith('localhost')) { this.ENV = 'DEV'; }
      else if (hostname.startsWith('test.cypherpunk')) { this.ENV = 'DEV'; }
      else { this.ENV = 'PROD'; }
    }

    // Detect BACKEND_HOST to use
    if (browser_env) {
      let hostname = document.location.hostname;
      if (hostname.startsWith('localhost')) {
        this.BACKEND_HOST = 'http://localhost:3000';
      }
      else if (hostname.startsWith('test.cypherpunk')) {
        this.BACKEND_HOST = 'https://test-api.cypherpunk.engineering';
      }
      // use dev BACKEND_HOST url
      else {
        this.BACKEND_HOST = 'https://cypherpunk.privacy.network';
      }
    }

    this.API_URL = this.BACKEND_HOST + '/api/' + this.API_VERSION;
  }
}
