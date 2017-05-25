import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SupportMacComponent } from './support-mac.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'support/mac', component: SupportMacComponent },
      { path: 'support/macos', component: SupportMacComponent }
    ])
  ]
})
export class SupportMacRoutingModule { }
