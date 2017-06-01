import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportOthersComponent } from './support-others.component';
import { SupportOthersRoutingModule } from './support-others-routing.module';

@NgModule({
  imports: [
    SupportSharedModule,
    SupportOthersRoutingModule
  ],
  declarations: [
    SupportOthersComponent
  ]
})
export class SupportOthersModule { }
