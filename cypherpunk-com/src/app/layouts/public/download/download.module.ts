import { NgModule } from '@angular/core';
import { DownloadComponent } from './download.component';
import { DownloadRoutingModule } from './download-routing.module';
import { SharedModule } from '../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    DownloadRoutingModule
  ],
  declarations: [
    DownloadComponent
  ]
})
export class DownloadModule { }
