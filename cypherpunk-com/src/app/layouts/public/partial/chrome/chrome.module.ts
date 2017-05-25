import { NgModule } from '@angular/core';
import { ChromePartialComponent } from './chrome.component';
import { ChromePartialRoutingModule } from './chrome-routing.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ChromePartialRoutingModule
  ],
  declarations: [
    ChromePartialComponent
  ]
})
export class ChromePartialModule { }
