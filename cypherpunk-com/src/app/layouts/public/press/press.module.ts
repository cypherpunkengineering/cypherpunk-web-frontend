import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { PressComponent } from './press.component';
import { PressRoutingModule } from './press-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PressRoutingModule
  ],
  declarations: [
    PressComponent,
  ]
})
export class PressModule { }
