import { NgModule } from '@angular/core';
import { SharedModule } from '../../../components/shared/shared.module';
import { SetupComponent } from './setup.component';
import { SetupRoutingModule } from './setup-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SetupRoutingModule
  ],
  declarations: [
    SetupComponent
  ]
})
export class SetupModule { }
