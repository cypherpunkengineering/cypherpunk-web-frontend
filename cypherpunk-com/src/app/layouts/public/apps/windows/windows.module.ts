import { NgModule } from '@angular/core';
import { WindowsComponent } from './windows.component';
import { AppsSharedModule } from '../apps-shared.module';
import { WindowsRoutingModule } from './windows-routing.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AppsSharedModule,
    WindowsRoutingModule
  ],
  declarations: [
    WindowsComponent
  ]
})
export class WindowsModule { }
