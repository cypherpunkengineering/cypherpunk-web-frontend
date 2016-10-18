import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './layouts/public/home/home.component';
import { DownloadComponent } from './layouts/public/download/download.component';
import { SignupComponent } from './layouts/public/signup/signup.component';
import { LoginComponent } from './layouts/public/login/login.component';
import { ResetComponent } from './layouts/public/reset/reset.component';
import { LearnComponent } from './layouts/public/learn/learn.component';
import { JoinComponent } from './layouts/public/join/join.component';
import { DashboardComponent } from './layouts/account/dashboard/dashboard.component';
import { ChangeEmailComponent } from './layouts/account/email/email.component';
import { NotFoundComponent } from './layouts/404/404.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'learn', component: LearnComponent },
  { path: 'join', component: JoinComponent },
  { path: 'account', component: DashboardComponent },
  { path: 'account/email', component: ChangeEmailComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
