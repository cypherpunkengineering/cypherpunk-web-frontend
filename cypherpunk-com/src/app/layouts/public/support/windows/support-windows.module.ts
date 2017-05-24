import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportWindowsComponent } from './support-windows.component';
import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportWindowsRoutingModule } from './support-windows-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportSharedModule,
    SupportWindowsRoutingModule
  ],
  declarations: [
    SupportWindowsComponent
  ]
})
export class SupportWindowsModule { }
