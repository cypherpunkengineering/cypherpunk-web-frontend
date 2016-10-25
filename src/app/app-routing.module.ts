import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';
import { ConfirmationGuard } from './services/confirmation-guard.service';

import { HomeComponent } from './layouts/public/home/home.component';
import { DownloadComponent } from './layouts/public/download/download.component';
import { SignupComponent } from './layouts/public/signup/signup.component';
import { LoginComponent } from './layouts/public/login/login.component';
import { ResetComponent } from './layouts/public/reset/reset.component';
import { LearnComponent } from './layouts/public/learn/learn.component';
import { JoinComponent } from './layouts/public/join/join.component';
import { ConfirmationComponent } from './layouts/public/confirmation/confirmation.component';
import { DashboardComponent } from './layouts/account/dashboard/dashboard.component';
import { ChangeEmailComponent } from './layouts/account/email/email.component';
import { ChangePasswordComponent } from './layouts/account/password/password.component';
import { BillingComponent } from './layouts/account/billing/billing.component';
import { UpgradeComponent } from './layouts/account/upgrade/upgrade.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'learn', component: LearnComponent },
  { path: 'join', component: JoinComponent },
  { path: 'confirmation/:accountId', component: ConfirmationComponent, canActivate: [ConfirmationGuard] },
  { path: 'user', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'user/email', component: ChangeEmailComponent, canActivate: [AuthGuard] },
  { path: 'user/password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'user/billing', component: BillingComponent, canActivate: [AuthGuard] },
  { path: 'user/upgrade', component: UpgradeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
