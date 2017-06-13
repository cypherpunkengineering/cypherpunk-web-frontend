import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardSharedModule } from './dashboard-shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [
    SharedModule,
    DashboardSharedModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardModule { }
