import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PrivacyComponent } from './privacy.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'pp', component: PrivacyComponent }
    ])
  ]
})
export class PrivacyRoutingModule { }
