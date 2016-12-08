import { NgModule } from '@angular/core';
import { SharedModule } from '../../../components/shared/shared.module';
import { SetupComponent } from './setup.component';
import { SetupRoutingModule } from './setup-routing.module';
import { LocationsResolver } from '../../../resolvers/locations.resolver';

@NgModule({
  imports: [
    SharedModule,
    SetupRoutingModule
  ],
  declarations: [
    SetupComponent
  ],
  providers: [
    LocationsResolver
  ]
})
export class SetupModule { }
