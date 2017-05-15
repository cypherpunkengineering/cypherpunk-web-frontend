import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportHomeComponent } from './support-home.component';
import { SupportHomeRoutingModule } from './support-home-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportHomeRoutingModule
  ],
  declarations: [
    SupportHomeComponent
  ]
})
export class SupportHomeModule { }
