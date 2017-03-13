import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../components/shared/shared.module';
import { RoutersComponent } from './routers.component';
import { RoutersRoutingModule } from './routers-routing.module';

@NgModule({
  imports: [
    SharedModule,
    RoutersRoutingModule
  ],
  declarations: [
    RoutersComponent
  ]
})
export class RoutersModule { }
