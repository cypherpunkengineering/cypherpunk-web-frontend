import { NgModule } from '@angular/core';
import { IosComponent } from './ios.component';
import { IosRoutingModule } from './ios-routing.module';
import { AppsSharedModule } from '../apps-shared.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AppsSharedModule,
    IosRoutingModule
  ],
  declarations: [
    IosComponent
  ]
})
export class IosModule { }
