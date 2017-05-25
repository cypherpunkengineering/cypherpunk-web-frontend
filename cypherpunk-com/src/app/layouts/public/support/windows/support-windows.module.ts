import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportWindowsComponent } from './support-windows.component';
import { SupportWindowsRoutingModule } from './support-windows-routing.module';

@NgModule({
  imports: [
    SupportSharedModule,
    SupportWindowsRoutingModule
  ],
  declarations: [
    SupportWindowsComponent
  ]
})
export class SupportWindowsModule { }
