import { NgModule } from '@angular/core';
import { MacComponent } from './mac.component';
import { MacRoutingModule } from './mac-routing.module';
import { AppsSharedModule } from '../apps-shared.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AppsSharedModule,
    MacRoutingModule
  ],
  declarations: [
    MacComponent
  ]
})
export class MacModule { }
