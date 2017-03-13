import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { PrivacyComponent } from './privacy.component';
import { PrivacyRoutingModule } from './privacy-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PrivacyRoutingModule
  ],
  declarations: [
    PrivacyComponent
  ]
})
export class PrivacyModule { }
