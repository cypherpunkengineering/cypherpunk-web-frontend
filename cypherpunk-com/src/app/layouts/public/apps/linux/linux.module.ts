import { NgModule } from '@angular/core';
import { LinuxComponent } from './linux.component';
import { AppsSharedModule } from '../apps-shared.module';
import { LinuxRoutingModule } from './linux-routing.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AppsSharedModule,
    LinuxRoutingModule
  ],
  declarations: [
    LinuxComponent
  ]
})
export class LinuxModule { }
