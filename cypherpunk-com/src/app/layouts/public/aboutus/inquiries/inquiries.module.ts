import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../components/shared/shared.module';
import { InquiriesComponent } from './inquiries.component';
import { InquiriesRoutingModule } from './inquiries-routing.module';

@NgModule({
  imports: [
    SharedModule,
    InquiriesRoutingModule
  ],
  declarations: [
    InquiriesComponent
  ]
})
export class InquiriesModule { }
