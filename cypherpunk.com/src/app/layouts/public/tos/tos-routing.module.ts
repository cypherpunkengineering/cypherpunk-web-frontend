import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TosComponent } from './tos.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'terms-of-service', component: TosComponent }
    ])
  ]
})
export class TosRoutingModule { }
