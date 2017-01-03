import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { FeaturesComponent } from './features.component';
import { FeaturesRoutingModule } from './features-routing.module';

@NgModule({
  imports: [
    SharedModule,
    FeaturesRoutingModule
  ],
  declarations: [
    FeaturesComponent
  ]
})
export class FeaturesModule { }
