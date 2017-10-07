import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { UnsubscribeComponent } from './unsubscribe.component';
import { UnsubscribeRoutingModule } from './unsubscribe-routing.module';

@NgModule({
  imports: [
    SharedModule,
    UnsubscribeRoutingModule
  ],
  declarations: [
    UnsubscribeComponent
  ]
})
export class UnsubscribeModule { }
