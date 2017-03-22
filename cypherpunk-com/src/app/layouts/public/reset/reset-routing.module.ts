import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PublicResetComponent } from './reset.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'reset', component: PublicResetComponent }
    ])
  ]
})
export class PublicResetRoutingModule { }
