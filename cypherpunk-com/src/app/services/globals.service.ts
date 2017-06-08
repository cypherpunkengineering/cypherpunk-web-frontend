import { Injectable } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class GlobalsService {
  ENV = 'DEV';
  API_VERSION = 'v1';
  BACKEND_HOST: string;
  API_URL = 'http://localhost:3000/api/' + this.API_VERSION;
  private devAPI = 'http://localhost:3000';
  private testAPI = 'https://test-api.cypherpunk.engineering';
  private prodAPI = 'https://cypherpunk.privacy.network';

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
      if (hostname.startsWith('localhost')) { this.BACKEND_HOST = this.devAPI; }
      else if (hostname.startsWith('test.cypherpunk')) { this.BACKEND_HOST = this.testAPI; }
      else { this.BACKEND_HOST = this.prodAPI; }
    }
    else { this.BACKEND_HOST = this.devAPI; }

    this.API_URL = this.BACKEND_HOST + '/api/' + this.API_VERSION;
  }
}
