import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { UpgradeComponent } from './upgrade.component';
import { UpgradeRoutingModule } from './upgrade-routing.module';

@NgModule({
  imports: [
    SharedModule,
    UpgradeRoutingModule
  ],
  declarations: [
    UpgradeComponent
  ]
})
export class UpgradeModule { }
