import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ActivateComponent } from './activate.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'activate', component: ActivateComponent }
    ])
  ]
})
export class ActivateRoutingModule { }
