import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreateAccountComponent } from './create-account.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'create', component: CreateAccountComponent }
    ])
  ]
})
export class CreateAccountRoutingModule { }
