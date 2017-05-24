import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SupportIOSComponent } from './support-ios.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'support/ios', component: SupportIOSComponent }
    ])
  ]
})
export class SupportIOSRoutingModule { }
