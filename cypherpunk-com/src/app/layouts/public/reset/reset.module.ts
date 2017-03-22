import { NgModule } from '@angular/core';
import { PublicResetComponent } from './reset.component';
import { PublicResetRoutingModule } from './reset-routing.module';
import { SharedModule } from '../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    PublicResetRoutingModule
  ],
  declarations: [
    PublicResetComponent
  ]
})
export class PublicResetModule { }
