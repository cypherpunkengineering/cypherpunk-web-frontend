import { NgModule } from '@angular/core';
import { VpnCredentialsComponent } from './vpn-credentials.component';
import { SharedModule } from '../../../../components/shared/shared.module';
import { VpnCredentialsRoutingModule } from './vpn-credentials-routing.module';

@NgModule({
  imports: [
    SharedModule,
    VpnCredentialsRoutingModule
  ],
  declarations: [
    VpnCredentialsComponent
  ]
})
export class VpnCredentialsModule { }
