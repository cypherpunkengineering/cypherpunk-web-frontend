import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../components/shared/shared.module';
import { FirefoxComponent } from './firefox.component';
import { FirefoxRoutingModule } from './firefox-routing.module';

@NgModule({
  imports: [
    SharedModule,
    FirefoxRoutingModule
  ],
  declarations: [
    FirefoxComponent
  ]
})
export class FirefoxModule { }
