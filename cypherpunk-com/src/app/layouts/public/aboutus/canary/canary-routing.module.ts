import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CanaryComponent } from './canary.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'about/canary', component: CanaryComponent }
    ])
  ]
})
export class CanaryRoutingModule { }
