import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../components/shared/shared.module';
import { ItunesPartialComponent } from './itunes.component';
import { ItunesPartialRoutingModule } from './itunes-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ItunesPartialRoutingModule
  ],
  declarations: [
    ItunesPartialComponent
  ]
})
export class ItunesPartialModule { }
