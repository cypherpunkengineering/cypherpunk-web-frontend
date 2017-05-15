import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SupportHomeComponent } from './support-home.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'support', component: SupportHomeComponent }
    ])
  ]
})
export class SupportHomeRoutingModule { }
