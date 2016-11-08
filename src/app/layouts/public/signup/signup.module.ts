import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { SignupComponent } from './signup.component';
import { SignupRoutingModule } from './signup-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SignupRoutingModule
  ],
  declarations: [
    SignupComponent
  ]
})
export class SignupModule { }
