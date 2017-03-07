import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { CreateAccountComponent } from './create-account.component';
import { CreateAccountRoutingModule } from './create-account-routing.module';

@NgModule({
  imports: [
    SharedModule,
    CreateAccountRoutingModule
  ],
  declarations: [
    CreateAccountComponent
  ]
})
export class CreateAccountModule { }
