import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UnsubscribeComponent } from './unsubscribe.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'unsubscribe', component: UnsubscribeComponent }
    ])
  ]
})
export class UnsubscribeRoutingModule { }
