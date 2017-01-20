import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FeaturesComponent } from './features.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'online-privacy', component: FeaturesComponent }
    ])
  ]
})
export class FeaturesRoutingModule { }
