import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../../services/auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'account', component: DashboardComponent }
    ])
  ]
})
export class DashboardRoutingModule { }
