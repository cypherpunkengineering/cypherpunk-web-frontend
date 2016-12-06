import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VpnComponent } from './vpn.component';
import { AuthGuard } from '../../../services/auth-guard.service';
import { LocationsResolver } from '../../../resolvers/locations.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'account/vpn',
        component: VpnComponent,
        canActivate: [AuthGuard],
        resolve: {
          locations: LocationsResolver
        }
      }
    ])
  ]
})
export class VpnRoutingModule { }
