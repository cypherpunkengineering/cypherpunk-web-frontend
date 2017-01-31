import { NgModule } from '@angular/core';
import { SharedModule } from '../../../components/shared/shared.module';
import { RecoverComponent } from './recover.component';
import { RecoverRoutingModule } from './recover-routing.module';

@NgModule({
  imports: [
    SharedModule,
    RecoverRoutingModule
  ],
  declarations: [
    RecoverComponent
  ]
})
export class RecoverModule { }
