import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SignupComponent } from './signup.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'signup', component: SignupComponent },
      { path: 'signup/:token', component: SignupComponent }
    ])
  ]
})
export class SignupRoutingModule { }
