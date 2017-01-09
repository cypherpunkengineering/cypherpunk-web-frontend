import { NgModule } from '@angular/core';
import { NetworkComponent } from './network.component';
import { NetworkRoutingModule } from './network-routing.module';
import { SharedModule } from '../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    NetworkRoutingModule
  ],
  declarations: [
    NetworkComponent
  ],
  providers: [
  ]
})
export class NetworkModule { }
