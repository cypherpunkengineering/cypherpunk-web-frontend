import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UpgradeComponent } from './upgrade.component';
import { AuthGuard } from '../../../services/auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'user/upgrade', component: UpgradeComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class UpgradeRoutingModule { }