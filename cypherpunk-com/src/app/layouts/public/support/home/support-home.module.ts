import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportHomeComponent } from './support-home.component';
import { SupportHomeRoutingModule } from './support-home-routing.module';

@NgModule({
  imports: [
    SupportSharedModule,
    SupportHomeRoutingModule
  ],
  declarations: [
    SupportHomeComponent
  ]
})
export class SupportHomeModule { }
