import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportBrowsersComponent } from './support-browsers.component';
import { SupportBrowsersRoutingModule } from './support-browsers-routing.module';

@NgModule({
  imports: [
    SupportSharedModule,
    SupportBrowsersRoutingModule
  ],
  declarations: [
    SupportBrowsersComponent
  ]
})
export class SupportBrowsersModule { }
