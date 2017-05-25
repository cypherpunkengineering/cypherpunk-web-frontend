import { NgModule } from '@angular/core';
import { SupportMacComponent } from './support-mac.component';
import { SupportSharedModule } from '../support-shared.module';
import { SupportMacRoutingModule } from './support-mac-routing.module';

@NgModule({
  imports: [
    SupportSharedModule,
    SupportMacRoutingModule
  ],
  declarations: [
    SupportMacComponent
  ]
})
export class SupportMacModule { }
