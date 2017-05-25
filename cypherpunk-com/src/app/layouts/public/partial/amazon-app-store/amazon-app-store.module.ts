import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../components/shared/shared.module';
import { AmazonAppStorePartialComponent } from './amazon-app-store.component';
import { AmazonAppStorePartialRoutingModule } from './amazon-app-store-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AmazonAppStorePartialRoutingModule
  ],
  declarations: [
    AmazonAppStorePartialComponent
  ]
})
export class AmazonAppStorePartialModule { }
