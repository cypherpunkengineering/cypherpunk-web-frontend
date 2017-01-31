import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { PricingComponent } from './pricing.component';
import { PricingRoutingModule } from './pricing-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PricingRoutingModule
  ],
  declarations: [
    PricingComponent
  ]
})
export class PricingModule { }
