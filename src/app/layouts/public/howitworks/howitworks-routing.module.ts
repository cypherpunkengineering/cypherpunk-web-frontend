import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HowitworksComponent } from './howitworks.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'howitworks', component: HowitworksComponent }
    ])
  ]
})
export class HowitworksRoutingModule { }
