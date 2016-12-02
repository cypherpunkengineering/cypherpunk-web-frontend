import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PremiumComponent } from './premium.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'premium', component: PremiumComponent }
    ])
  ]
})
export class PremiumRoutingModule { }
