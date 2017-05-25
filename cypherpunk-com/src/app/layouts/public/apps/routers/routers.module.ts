import { NgModule } from '@angular/core';
import { RoutersComponent } from './routers.component';
import { AppsSharedModule } from '../apps-shared.module';
import { RoutersRoutingModule } from './routers-routing.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AppsSharedModule,
    RoutersRoutingModule
  ],
  declarations: [
    RoutersComponent
  ]
})
export class RoutersModule { }
