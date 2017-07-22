import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../components/shared/shared.module';
import { CanaryComponent } from './canary.component';
import { CanaryRoutingModule } from './canary-routing.module';

@NgModule({
  imports: [
    SharedModule,
    CanaryRoutingModule
  ],
  declarations: [
    CanaryComponent
  ]
})
export class CanaryModule { }
