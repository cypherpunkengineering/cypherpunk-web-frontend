import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ResetComponent } from './reset.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'account/reset',
        component: ResetComponent
      }
    ])
  ]
})
export class ResetRoutingModule { }
