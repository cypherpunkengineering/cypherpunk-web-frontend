import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportRoutersComponent } from './support-routers.component';
import { SupportRoutersRoutingModule } from './support-routers-routing.module';

@NgModule({
  imports: [
    SupportSharedModule,
    SupportRoutersRoutingModule
  ],
  declarations: [
    SupportRoutersComponent
  ]
})
export class SupportRoutersModule { }
