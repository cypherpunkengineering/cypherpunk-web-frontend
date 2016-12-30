import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../components/shared/shared.module';
import { ChromeComponent } from './chrome.component';
import { ChromeRoutingModule } from './chrome-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ChromeRoutingModule
  ],
  declarations: [
    ChromeComponent
  ]
})
export class ChromeModule { }
