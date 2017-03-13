import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { DownloadComponent } from './download.component';
import { DownloadBaseComponent } from './download-base.component';
import { DownloadRoutingModule } from './download-routing.module';

@NgModule({
  imports: [
    SharedModule,
    DownloadRoutingModule
  ],
  declarations: [
    DownloadComponent,
    DownloadBaseComponent
  ]
})
export class DownloadModule { }
