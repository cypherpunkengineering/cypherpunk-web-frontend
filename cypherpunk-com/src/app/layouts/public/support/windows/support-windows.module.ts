import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportWindowsComponent } from './support-windows.component';
import { SupportWindowsRoutingModule } from './support-windows-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportWindowsRoutingModule
  ],
  declarations: [
    SupportWindowsComponent
  ]
})
export class SupportWindowsModule { }
