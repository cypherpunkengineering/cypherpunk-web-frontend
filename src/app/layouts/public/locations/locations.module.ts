import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { LocationsComponent } from './locations.component';
import { LocationsRoutingModule } from './locations-routing.module';

@NgModule({
  imports: [
    SharedModule,
    LocationsRoutingModule
  ],
  declarations: [
    LocationsComponent
  ]
})
export class LocationsModule { }
