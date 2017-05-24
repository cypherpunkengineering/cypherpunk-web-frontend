import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportBrowsersComponent } from './support-browsers.component';
import { SupportBrowsersRoutingModule } from './support-browsers-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportBrowsersRoutingModule
  ],
  declarations: [
    SupportBrowsersComponent
  ]
})
export class SupportBrowsersModule { }
