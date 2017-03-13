import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { SigninComponent } from './signin.component';
import { SigninRoutingModule } from './signin-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SigninRoutingModule
  ],
  declarations: [
    SigninComponent
  ]
})
export class SigninModule { }
