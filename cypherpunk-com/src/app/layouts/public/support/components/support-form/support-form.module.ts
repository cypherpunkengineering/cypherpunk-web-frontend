import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportFormComponent } from './support-form.component';
import { SupportFormRoutingModule } from './support-form-routing.module';

@NgModule({
  imports: [
    SupportSharedModule,
    SupportFormRoutingModule
  ],
  declarations: [
    SupportFormComponent
  ]
})
export class SupportFormModule { }
