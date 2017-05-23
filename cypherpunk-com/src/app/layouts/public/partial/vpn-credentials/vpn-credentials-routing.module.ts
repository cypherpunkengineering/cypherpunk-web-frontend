import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VpnCredentialsComponent } from './vpn-credentials.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'partial/credentials', component: VpnCredentialsComponent },
    ])
  ]
})
export class VpnCredentialsRoutingModule { }
