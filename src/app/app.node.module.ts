// Fix Material Support
import { __platform_browser_private__ } from '@angular/platform-browser';
function universalMaterialSupports(eventName: string): boolean { return Boolean(this.isCustomEvent(eventName)); }
__platform_browser_private__.HammerGesturesPlugin.prototype.supports = universalMaterialSupports;
// End Fix Material Support

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UniversalModule, isBrowser, isNode } from 'angular2-universal/node'; // for AoT we need to manually split universal packages

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';

import { HomeModule } from './layouts/public/home/home.module';
import { JoinModule } from './layouts/public/join/join.module';
import { LoginModule } from './layouts/public/login/login.module';
import { ResetModule } from './layouts/public/reset/reset.module';
import { SignupModule } from './layouts/public/signup/signup.module';
import { DownloadModule } from './layouts/public/download/download.module';
import { ConfirmModule } from './layouts/public/confirm/confirm.module';
import { WhyusModule } from './layouts/public/whyus/whyus.module';
import { HowitworksModule } from './layouts/public/howitworks/howitworks.module';
import { LocationsModule } from './layouts/public/locations/locations.module';
import { PrivacyModule } from './layouts/public/privacy/privacy.module';
import { AboutusModule } from './layouts/public/aboutus/aboutus.module';

import { DashboardModule } from './layouts/user/dashboard/dashboard.module';
import { BillingModule } from './layouts/user/billing/billing.module';
import { UpgradeModule } from './layouts/user/upgrade/upgrade.module';

import { CacheService } from './universal-cache';
import { SessionService } from './services/session.service';
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';
import { AuthGuard } from './services/auth-guard.service';
import { ConfirmGuard } from './services/confirm-guard.service';
import { PlansService } from './services/plans.service';

import { LocalStorage } from './services/local-storage';

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [
    UniversalModule, // NodeModule, NodeHttpModule, and NodeJsonpModule are included
    FormsModule,

    AppRoutingModule,
    SharedModule,

    HomeModule,
    JoinModule,
    LoginModule,
    ResetModule,
    SignupModule,
    DownloadModule,
    ConfirmModule,
    WhyusModule,
    HowitworksModule,
    LocationsModule,
    PrivacyModule,
    AboutusModule,

    DashboardModule,
    BillingModule,
    UpgradeModule
  ],
  providers: [
    { provide: 'isBrowser', useValue: isBrowser },
    { provide: 'isNode', useValue: isNode },
    { provide: LocalStorage, useValue: { getItem() {} } },
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

  }

  /**
   * We need to use the arrow function here to bind the context as this is a gotcha
   * in Universal for now until it's fixed
   */
  universalDoDehydrate = (universalCache) => {
    universalCache[CacheService.KEY] = JSON.stringify(this.cache.dehydrate());
  }

 /**
  * Clear the cache after it's rendered
  */
  universalAfterDehydrate = () => {
    this.cache.clear();
  }
}
