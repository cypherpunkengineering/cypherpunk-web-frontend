import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../components/shared/shared.module';
import { BrowsersComponent } from './browsers.component';
import { BrowsersRoutingModule } from './browsers-routing.module';

@NgModule({
  imports: [
    SharedModule,
    BrowsersRoutingModule
  ],
  declarations: [
    BrowsersComponent
  ]
})
export class BrowsersModule { }
