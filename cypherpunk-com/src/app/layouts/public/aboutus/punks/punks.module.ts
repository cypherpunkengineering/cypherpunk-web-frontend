import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../components/shared/shared.module';
import { PunksComponent } from './punks.component';
import { PunksRoutingModule } from './punks-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PunksRoutingModule
  ],
  declarations: [
    PunksComponent
  ]
})
export class PunksModule { }
