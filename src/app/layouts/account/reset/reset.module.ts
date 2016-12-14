import { NgModule } from '@angular/core';
import { ResetComponent } from './reset.component';
import { ResetRoutingModule } from './reset-routing.module';
import { SharedModule } from '../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ResetRoutingModule
  ],
  declarations: [
    ResetComponent
  ]
})
export class ResetModule { }
