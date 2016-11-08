import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DownloadComponent } from './download.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'download', component: DownloadComponent },
      { path: 'download.html', redirectTo: '/download' }
    ])
  ]
})
export class DownloadRoutingModule { }
