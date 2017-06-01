import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SupportFormComponent } from './support-form.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'support/request/new', component: SupportFormComponent }
    ])
  ]
})
export class SupportFormRoutingModule { }
