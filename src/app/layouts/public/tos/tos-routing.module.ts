import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TosComponent } from './tos.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'tos', component: TosComponent }
    ])
  ]
})
export class TosRoutingModule { }
