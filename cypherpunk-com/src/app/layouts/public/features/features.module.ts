import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { FeaturesComponent } from './features.component';
import { RedirectComponent } from './features-routing.module';
import { FeaturesRoutingModule } from './features-routing.module';

@NgModule({
  imports: [
    SharedModule,
    FeaturesRoutingModule
  ],
  declarations: [
    FeaturesComponent,
    RedirectComponent
  ]
})
export class FeaturesModule { }
