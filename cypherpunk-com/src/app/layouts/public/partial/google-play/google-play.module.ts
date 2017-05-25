import { NgModule } from '@angular/core';
import { GooglePlayPartialComponent } from './google-play.component';
import { SharedModule } from '../../../../components/shared/shared.module';
import { GooglePlayPartialRoutingModule } from './google-play-routing.module';

@NgModule({
  imports: [
    SharedModule,
    GooglePlayPartialRoutingModule
  ],
  declarations: [
    GooglePlayPartialComponent
  ]
})
export class GooglePlayPartialModule { }
