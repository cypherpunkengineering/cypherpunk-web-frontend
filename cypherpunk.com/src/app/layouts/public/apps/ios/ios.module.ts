import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../components/shared/shared.module';
import { IosComponent } from './ios.component';
import { IosRoutingModule } from './ios-routing.module';

@NgModule({
  imports: [
    SharedModule,
    IosRoutingModule
  ],
  declarations: [
    IosComponent
  ]
})
export class IosModule { }
