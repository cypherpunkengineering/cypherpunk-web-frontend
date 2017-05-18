import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportMacComponent } from './support-mac.component';
import { SupportMacRoutingModule } from './support-mac-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportMacRoutingModule
  ],
  declarations: [
    SupportMacComponent
  ]
})
export class SupportMacModule { }
