import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { HowitworksComponent } from './howitworks.component';
import { HowitworksRoutingModule } from './howitworks-routing.module';

@NgModule({
  imports: [
    SharedModule,
    HowitworksRoutingModule
  ],
  declarations: [
    HowitworksComponent
  ]
})
export class HowitworksModule { }
