import { NgModule } from '@angular/core';
import { ConfirmChangeComponent } from './confirm-change.component';
import { SharedModule } from '../../../components/shared/shared.module';
import { ConfirmChangeRoutingModule } from './confirm-change-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ConfirmChangeRoutingModule
  ],
  declarations: [
    ConfirmChangeComponent
  ]
})
export class ConfirmChangeModule { }
