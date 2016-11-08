import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JoinComponent } from './join.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'join', component: JoinComponent }
    ])
  ]
})
export class JoinRoutingModule { }
