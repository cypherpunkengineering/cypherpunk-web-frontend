import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InquiriesComponent } from './inquiries.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'about/inquiries', component: InquiriesComponent }
    ])
  ]
})
export class InquiriesRoutingModule { }
