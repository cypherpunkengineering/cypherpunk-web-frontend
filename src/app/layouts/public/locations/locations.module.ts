import { NgModule } from '@angular/core';
import { LocationsComponent } from './locations.component';
import { LocationsRoutingModule } from './locations-routing.module';
import { SharedModule } from '../../../components/shared/shared.module';
import { LocationsResolver } from '../../../resolvers/locations.resolver';

@NgModule({
  imports: [
    SharedModule,
    LocationsRoutingModule
  ],
  declarations: [
    LocationsComponent
  ],
  providers: [
    LocationsResolver
  ]
})
export class LocationsModule { }
