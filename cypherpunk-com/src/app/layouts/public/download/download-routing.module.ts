import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DownloadComponent } from './download.component';
import { DownloadBaseComponent } from './download-base.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'download', pathMatch: 'full', component: DownloadBaseComponent },
      { path: 'download/:platform', component: DownloadComponent }
    ])
  ]
})
export class DownloadRoutingModule { }
