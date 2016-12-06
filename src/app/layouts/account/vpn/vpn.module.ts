import { NgModule } from '@angular/core';
import { SharedModule } from '../../../components/shared/shared.module';
import { VpnComponent } from './vpn.component';
import { VpnRoutingModule } from './vpn-routing.module';
import { LocationsResolver } from '../../../resolvers/locations.resolver';

@NgModule({
  imports: [
    SharedModule,
    VpnRoutingModule
  ],
  declarations: [
    VpnComponent
  ],
  providers: [
    LocationsResolver
  ]
})
export class VpnModule { }
