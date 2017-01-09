import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';

import { HomeModule } from './layouts/public/home/home.module';
import { PricingModule } from './layouts/public/pricing/pricing.module';
import { SigninModule } from './layouts/public/signin/signin.module';
import { RecoverModule } from './layouts/public/recover/recover.module';
import { DownloadModule } from './layouts/public/download/download.module';
import { ConfirmModule } from './layouts/public/confirm/confirm.module';
import { WhyusModule } from './layouts/public/whyus/whyus.module';
import { FeaturesModule } from './layouts/public/features/features.module';
import { NetworkModule } from './layouts/public/network/network.module';
import { PrivacyModule } from './layouts/public/privacy/privacy.module';
import { AboutusModule } from './layouts/public/aboutus/aboutus.module';
import { TosModule } from './layouts/public/tos/tos.module';
import { NotFoundModule } from './layouts/public/notfound/notfound.module';
import { BlogModule } from './layouts/public/blog/blog.module';
import { ChromeModule } from './layouts/public/available/chrome/chrome.module';
import { MacModule } from './layouts/public/available/mac/mac.module';
import { WindowsModule } from './layouts/public/available/windows/windows.module';
import { IosModule } from './layouts/public/available/ios/ios.module';
import { AndroidModule } from './layouts/public/available/android/android.module';
import { LinuxModule } from './layouts/public/available/linux/linux.module';
import { RoutersModule } from './layouts/public/available/routers/routers.module';
import { FirefoxModule } from './layouts/public/available/firefox/firefox.module';
import { CommunityModule } from './layouts/public/community/community.module';

import { DashboardModule } from './layouts/account/dashboard/dashboard.module';
import { BillingModule } from './layouts/account/billing/billing.module';
import { UpgradeModule } from './layouts/account/upgrade/upgrade.module';
import { SetupModule } from './layouts/account/setup/setup.module';
import { ResetModule } from './layouts/account/reset/reset.module';

import { CacheService } from './components/shared/cache.service';
import { SessionService } from './services/session.service';
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';
import { AuthGuard } from './services/auth-guard.service';
import { ConfirmGuard } from './services/confirm-guard.service';
import { PlansService } from './services/plans.service';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    SharedModule,

    HomeModule,
    PricingModule,
    SigninModule,
    RecoverModule,
    DownloadModule,
    ConfirmModule,
    WhyusModule,
    FeaturesModule,
    NetworkModule,
    PrivacyModule,
    AboutusModule,
    TosModule,
    NotFoundModule,
    BlogModule,
    ChromeModule,
    MacModule,
    WindowsModule,
    IosModule,
    AndroidModule,
    LinuxModule,
    RoutersModule,
    FirefoxModule,
    CommunityModule,

    DashboardModule,
    BillingModule,
    UpgradeModule,
    SetupModule,
    ResetModule,

    AppRoutingModule
  ],
  providers: [
    CacheService,
    SessionService,
    AuthService,
    AlertService,
    AuthGuard,
    ConfirmGuard,
    PlansService
  ]
})
export class AppModule {
}

export { AppComponent } from './app.component';
