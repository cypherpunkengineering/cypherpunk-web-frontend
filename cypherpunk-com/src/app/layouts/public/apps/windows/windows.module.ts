import { NgModule } from '@angular/core';
import { WindowsComponent } from './windows.component';
import { AppsSharedModule } from '../apps-shared.module';
import { WindowsRoutingModule } from './windows-routing.module';

@NgModule({
  imports: [
    AppsSharedModule,
    WindowsRoutingModule
  ],
  declarations: [
    WindowsComponent
  ]
})
export class WindowsModule { }
