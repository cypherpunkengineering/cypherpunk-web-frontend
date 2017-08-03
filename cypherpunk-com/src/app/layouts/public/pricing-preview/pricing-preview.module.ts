import { NgModule } from '@angular/core';
import { SharedModule } from '../../../components/shared/shared.module';
import { PricingPreviewComponent } from './pricing-preview.component';
import { PricingPreviewRoutingModule } from './pricing-preview-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PricingPreviewRoutingModule
  ],
  declarations: [
    PricingPreviewComponent
  ]
})
export class PricingPreviewModule { }
