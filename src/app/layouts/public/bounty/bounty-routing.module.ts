import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BountyComponent } from './bounty.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'bounty', component: BountyComponent }
    ])
  ]
})
export class BountyRoutingModule { }
