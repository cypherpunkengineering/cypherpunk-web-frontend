import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { CommunityComponent } from './community.component';
import { CommunityRoutingModule } from './community-routing.module';

@NgModule({
  imports: [
    SharedModule,
    CommunityRoutingModule
  ],
  declarations: [
    CommunityComponent
  ]
})
export class CommunityModule { }
