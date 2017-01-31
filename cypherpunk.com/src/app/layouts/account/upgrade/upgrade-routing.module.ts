import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpgradeComponent } from './upgrade.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'account/upgrade',
        component: UpgradeComponent
      }
    ])
  ]
})
export class UpgradeRoutingModule { }
