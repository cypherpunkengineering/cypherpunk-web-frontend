import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UniversalModule, isBrowser, isNode } from 'angular2-universal/browser'; // for AoT we need to manually split universal packages

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';

import { HomeModule } from './layouts/public/home/home.module';
import { PremiumModule } from './layouts/public/premium/premium.module';
import { LoginModule } from './layouts/public/login/login.module';
import { ResetModule } from './layouts/public/reset/reset.module';
import { DownloadModule } from './layouts/public/download/download.module';
import { ConfirmModule } from './layouts/public/confirm/confirm.module';
import { WhyusModule } from './layouts/public/whyus/whyus.module';
import { HowitworksModule } from './layouts/public/howitworks/howitworks.module';
import { LocationsModule } from './layouts/public/locations/locations.module';
import { PrivacyModule } from './layouts/public/privacy/privacy.module';
import { AboutusModule } from './layouts/public/aboutus/aboutus.module';
import { TosModule } from './layouts/public/tos/tos.module';
import { BountyModule } from './layouts/public/bounty/bounty.module';
import { NotFoundModule } from './layouts/public/notfound/notfound.module';

import { DashboardModule } from './layouts/account/dashboard/dashboard.module';
import { BillingModule } from './layouts/account/billing/billing.module';
import { UpgradeModule } from './layouts/account/upgrade/upgrade.module';

import { CacheService } from './universal-cache';
import { SessionService } from './services/session.service';
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';
import { AuthGuard } from './services/auth-guard.service';
import { ConfirmGuard } from './services/confirm-guard.service';
import { PlansService } from './services/plans.service';

import { LocalStorage } from './services/local-storage';

// TODO(gdi2290): refactor into Universal
export const UNIVERSAL_KEY = 'UNIVERSAL_CACHE';

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [
    UniversalModule, // BrowserModule, HttpModule, and JsonpModule are included
    FormsModule,

    SharedModule,

    HomeModule,
    PremiumModule,
    LoginModule,
    ResetModule,
    DownloadModule,
    ConfirmModule,
    WhyusModule,
    HowitworksModule,
    LocationsModule,
    PrivacyModule,
    AboutusModule,
    TosModule,
    BountyModule,
    NotFoundModule,

    DashboardModule,
    BillingModule,
    UpgradeModule,

    AppRoutingModule
  ],
  providers: [
    { provide: 'isBrowser', useValue: isBrowser },
    { provide: 'isNode', useValue: isNode },
    { provide: LocalStorage, useValue: window.localStorage },
    CacheService,
    SessionService,
    AuthService,
    AlertService,
    AuthGuard,
    ConfirmGuard,
    PlansService
  ]
})
export class MainModule {
  constructor(public cache: CacheService) {
    // TODO(gdi2290): refactor into a lifecycle hook
    this.doRehydrate();
  }

  doRehydrate() {
    let defaultValue = {};
    let serverCache = this._getCacheValue(CacheService.KEY, defaultValue);
    this.cache.rehydrate(serverCache);
  }

  _getCacheValue(key: string, defaultValue: any): any {
    // browser
    const win: any = window;
    if (win[UNIVERSAL_KEY] && win[UNIVERSAL_KEY][key]) {
      let serverCache = defaultValue;
      try {
        serverCache = JSON.parse(win[UNIVERSAL_KEY][key]);
        if (typeof serverCache !== typeof defaultValue) {
          console.log('Angular Universal: The type of data from the server is different from the default value type');
          serverCache = defaultValue;
        }
      } catch (e) {
        console.log('Angular Universal: There was a problem parsing the server data during rehydrate');
        serverCache = defaultValue;
      }
      return serverCache;
    } else {
      console.log('Angular Universal: UNIVERSAL_CACHE is missing');
    }
    return defaultValue;
  }
}
