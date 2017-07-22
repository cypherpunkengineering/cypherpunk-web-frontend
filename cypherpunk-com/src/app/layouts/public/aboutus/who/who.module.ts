import { NgModule } from '@angular/core';
import { WhoComponent } from './who.component';
import { WhoRoutingModule } from './who-routing.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    WhoRoutingModule
  ],
  declarations: [
    WhoComponent
  ]
})
export class WhoModule { }
