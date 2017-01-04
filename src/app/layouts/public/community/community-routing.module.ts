import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommunityComponent } from './community.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'community', component: CommunityComponent }
    ])
  ]
})
export class CommunityRoutingModule { }
