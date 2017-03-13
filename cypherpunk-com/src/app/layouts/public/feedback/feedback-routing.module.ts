import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FeedbackComponent } from './feedback.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'feedback', component: FeedbackComponent }
    ])
  ]
})
export class FeedbackRoutingModule { }
