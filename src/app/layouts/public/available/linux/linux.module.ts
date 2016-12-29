import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../components/shared/shared.module';
import { LinuxComponent } from './linux.component';
import { LinuxRoutingModule } from './linux-routing.module';

@NgModule({
  imports: [
    SharedModule,
    LinuxRoutingModule
  ],
  declarations: [
    LinuxComponent
  ]
})
export class LinuxModule { }
