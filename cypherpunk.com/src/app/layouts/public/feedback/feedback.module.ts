import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { FeedbackComponent } from './feedback.component';
import { FeedbackRoutingModule } from './feedback-routing.module';

@NgModule({
  imports: [
    SharedModule,
    FeedbackRoutingModule
  ],
  declarations: [
    FeedbackComponent
  ]
})
export class FeedbackModule { }
