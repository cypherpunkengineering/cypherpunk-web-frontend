import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../components/shared/shared.module';
import { WindowsComponent } from './windows.component';
import { WindowsRoutingModule } from './windows-routing.module';

@NgModule({
  imports: [
    SharedModule,
    WindowsRoutingModule
  ],
  declarations: [
    WindowsComponent
  ]
})
export class WindowsModule { }
