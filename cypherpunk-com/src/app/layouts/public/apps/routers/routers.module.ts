import { NgModule } from '@angular/core';
import { RoutersComponent } from './routers.component';
import { AppsSharedModule } from '../apps-shared.module';
import { RoutersRoutingModule } from './routers-routing.module';

@NgModule({
  imports: [
    AppsSharedModule,
    RoutersRoutingModule
  ],
  declarations: [
    RoutersComponent
  ]
})
export class RoutersModule { }
