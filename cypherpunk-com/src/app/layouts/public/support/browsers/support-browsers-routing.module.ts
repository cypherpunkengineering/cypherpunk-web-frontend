import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SupportBrowsersComponent } from './support-browsers.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'support/browsers', component: SupportBrowsersComponent }
    ])
  ]
})
export class SupportBrowsersRoutingModule { }
