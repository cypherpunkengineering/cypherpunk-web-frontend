import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WhyusComponent } from './whyus.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'whyus', component: WhyusComponent }
    ])
  ]
})
export class WhyusRoutingModule { }
