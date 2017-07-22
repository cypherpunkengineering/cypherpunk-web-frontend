import { NgModule } from '@angular/core';
import { AssetsComponent } from './assets.component';
import { AssetsRoutingModule } from './assets-routing.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AssetsRoutingModule
  ],
  declarations: [
    AssetsComponent
  ]
})
export class AssetsModule { }
