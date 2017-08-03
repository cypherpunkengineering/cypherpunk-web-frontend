import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PricingPreviewComponent } from './pricing-preview.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'pricing/preview', component: PricingPreviewComponent }
    ])
  ]
})
export class PricingPreviewRoutingModule { }
