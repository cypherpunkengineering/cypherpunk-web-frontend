import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SupportLinuxComponent } from './support-linux.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'support/linux', component: SupportLinuxComponent }
    ])
  ]
})
export class SupportLinuxRoutingModule { }
