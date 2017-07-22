import { NgModule } from '@angular/core';
import { SharedModule } from '../../../components/shared/shared.module';
import { ActivateComponent } from './activate.component';
import { ActivateRoutingModule } from './activate-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ActivateRoutingModule
  ],
  declarations: [
    ActivateComponent
  ]
})
export class ActivateModule { }
