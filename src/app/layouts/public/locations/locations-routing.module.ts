import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocationsComponent } from './locations.component';
import { LocationsResolver } from '../../../resolvers/locations.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'locations',
        component: LocationsComponent,
        resolve: {
          locations: LocationsResolver
        }
      }
    ])
  ]
})
export class LocationsRoutingModule { }
