import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { RootComponent } from './app-root.component';
import { HomeComponent } from './layouts/public/home/home.component';
import { DownloadComponent } from './layouts/public/download/download.component';
import { SignupComponent } from './layouts/public/signup/signup.component';
import { LoginComponent } from './layouts/public/login/login.component';
import { ResetComponent } from './layouts/public/reset/reset.component';
import { LearnComponent } from './layouts/public/learn/learn.component';
import { JoinComponent } from './layouts/public/join/join.component';
import { DashboardComponent } from './layouts/account/dashboard/dashboard.component';
import { ChangeEmailComponent } from './layouts/account/email/email.component';
import { ChangePasswordComponent } from './layouts/account/password/password.component';
import { NotFoundComponent } from './layouts/404/404.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AccountNavigationComponent } from './components/account-navigation/account-navigation.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  // all components must be declared here
  declarations: [
    RootComponent,
    HomeComponent,
    DownloadComponent,
    SignupComponent,
    LoginComponent,
    ResetComponent,
    LearnComponent,
    JoinComponent,
    DashboardComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    NotFoundComponent,
    NavigationComponent,
    AccountNavigationComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
