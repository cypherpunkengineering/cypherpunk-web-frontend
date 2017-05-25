import { NgModule } from '@angular/core';
import { LinuxComponent } from './linux.component';
import { AppsSharedModule } from '../apps-shared.module';
import { LinuxRoutingModule } from './linux-routing.module';

@NgModule({
  imports: [
    AppsSharedModule,
    LinuxRoutingModule
  ],
  declarations: [
    LinuxComponent
  ]
})
export class LinuxModule { }
