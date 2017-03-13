import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WhatsMyIpComponent } from './whatsmyip.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'whatsmyip', component: WhatsMyIpComponent }
    ])
  ]
})
export class WhatsMyIpRoutingModule { }
