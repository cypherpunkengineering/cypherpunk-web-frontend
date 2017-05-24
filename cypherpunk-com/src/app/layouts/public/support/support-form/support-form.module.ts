import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportFormComponent } from './support-form.component';
import { SupportFormRoutingModule } from './support-form-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportFormRoutingModule
  ],
  declarations: [
    SupportFormComponent
  ]
})
export class SupportFormModule { }
