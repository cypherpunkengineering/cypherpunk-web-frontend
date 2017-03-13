import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'account', component: DashboardComponent }
    ])
  ]
})
export class DashboardRoutingModule { }
