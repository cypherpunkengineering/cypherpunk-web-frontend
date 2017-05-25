import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';
import { HttpModule } from '@angular/http';

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
import { BlogPostModule } from './layouts/public/blog-post/blog-post.module';
import { BrowserModule } from './layouts/public/apps/browser/browser.module';
import { MacModule } from './layouts/public/apps/mac/mac.module';
import { WindowsModule } from './layouts/public/apps/windows/windows.module';
import { IosModule } from './layouts/public/apps/ios/ios.module';
import { AndroidModule } from './layouts/public/apps/android/android.module';
import { LinuxModule } from './layouts/public/apps/linux/linux.module';
import { RoutersModule } from './layouts/public/apps/routers/routers.module';
import { FeedbackModule } from './layouts/public/feedback/feedback.module';
import { BountyModule } from './layouts/public/bounty/bounty.module';
import { AppsModule } from './layouts/public/apps/apps/apps.module';
import { WhatsMyIpModule } from './layouts/public/whatsmyip/whatsmyip.module';
import { SignupModule } from './layouts/public/signup/signup.module';
import { PublicResetModule } from './layouts/public/reset/reset.module';
import { SupportHomeModule } from './layouts/public/support/home/support-home.module';
import { SupportArticleModule } from './layouts/public/support/articles/support-article.module';
import { SupportWindowsModule } from './layouts/public/support/windows/support-windows.module';
import { SupportMacModule } from './layouts/public/support/mac/support-mac.module';
import { SupportAndroidModule } from './layouts/public/support/android/support-android.module';
import { SupportIOSModule } from './layouts/public/support/ios/support-ios.module';
import { SupportLinuxModule } from './layouts/public/support/linux/support-linux.module';
import { SupportBrowsersModule } from './layouts/public/support/browsers/support-browsers.module';
import { SupportFormModule } from './layouts/public/support/support-form/support-form.module';

import { HostnameSelectorModule } from './layouts/public/partial/hostname-selector/hostname-selector.module';
import { VpnCredentialsModule } from './layouts/public/partial/vpn-credentials/vpn-credentials.module';
import { CertModule } from './layouts/public/partial/cert/cert.module';
import { ConfigGeneratorModule } from './layouts/public/partial/config-generator/config-generator.module';
import { GooglePlayPartialModule } from './layouts/public/partial/google-play/google-play.module';
import { AmazonAppStorePartialModule } from './layouts/public/partial/amazon-app-store/amazon-app-store.module';
import { ItunesPartialModule } from './layouts/public/partial/itunes/itunes.module';

import { DashboardModule } from './layouts/account/dashboard/dashboard.module';
import { BillingModule } from './layouts/account/billing/billing.module';
import { UpgradeModule } from './layouts/account/upgrade/upgrade.module';
import { SetupModule } from './layouts/account/setup/setup.module';
import { ResetModule } from './layouts/account/reset/reset.module';

import { SessionService } from './services/session.service';
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';
import { AuthGuard } from './services/auth-guard.service';
import { ConfirmGuard } from './services/confirm-guard.service';
import { PlansService } from './services/plans.service';
import { BackendService } from './services/backend.service';

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
    BlogPostModule,
    BrowserModule,
    MacModule,
    WindowsModule,
    IosModule,
    AndroidModule,
    LinuxModule,
    RoutersModule,
    FeedbackModule,
    BountyModule,
    AppsModule,
    WhatsMyIpModule,
    SignupModule,
    PublicResetModule,
    SupportHomeModule,
    SupportFormModule,
    SupportArticleModule,
    SupportWindowsModule,
    SupportMacModule,
    SupportAndroidModule,
    SupportIOSModule,
    SupportLinuxModule,
    SupportBrowsersModule,

    HostnameSelectorModule,
    VpnCredentialsModule,
    CertModule,
    ConfigGeneratorModule,
    GooglePlayPartialModule,
    AmazonAppStorePartialModule,
    ItunesPartialModule,

    DashboardModule,
    BillingModule,
    UpgradeModule,
    SetupModule,
    ResetModule,

    AppRoutingModule,
    HttpModule
  ],
  providers: [
    SessionService,
    AuthService,
    AlertService,
    AuthGuard,
    ConfirmGuard,
    PlansService,
    BackendService
  ]
})
export class AppModule {
}

export { AppComponent } from './app.component';
