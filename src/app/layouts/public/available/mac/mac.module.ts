import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../components/shared/shared.module';
import { MacComponent } from './mac.component';
import { MacRoutingModule } from './mac-routing.module';

@NgModule({
  imports: [
    SharedModule,
    MacRoutingModule
  ],
  declarations: [
    MacComponent
  ]
})
export class MacModule { }
