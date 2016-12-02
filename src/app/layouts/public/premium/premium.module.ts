import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { PremiumComponent } from './premium.component';
import { PremiumRoutingModule } from './premium-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PremiumRoutingModule
  ],
  declarations: [
    PremiumComponent
  ]
})
export class PremiumModule { }
