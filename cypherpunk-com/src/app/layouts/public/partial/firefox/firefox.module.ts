import { NgModule } from '@angular/core';
import { FirefoxPartialComponent } from './firefox.component';
import { FirefoxPartialRoutingModule } from './firefox-routing.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FirefoxPartialRoutingModule
  ],
  declarations: [
    FirefoxPartialComponent
  ]
})
export class FirefoxPartialModule { }
