import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FeaturesComponent } from './features.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'features', component: FeaturesComponent }
    ])
  ]
})
export class FeaturesRoutingModule { }
