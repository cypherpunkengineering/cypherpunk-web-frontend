import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './layouts/public/home/home.component';
import { DownloadComponent } from './layouts/public/download/download.component';
import { NotFoundComponent } from './layouts/404/404.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'download', component: DownloadComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
