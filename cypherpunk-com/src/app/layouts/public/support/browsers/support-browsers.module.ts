import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportBrowsersComponent } from './support-browsers.component';
import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportBrowsersRoutingModule } from './support-browsers-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportSharedModule,
    SupportBrowsersRoutingModule
  ],
  declarations: [
    SupportBrowsersComponent
  ]
})
export class SupportBrowsersModule { }
