import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { NotFoundComponent } from './notfound.component';
import { NotFoundRoutingModule } from './notfound-routing.module';

@NgModule({
  imports: [
    SharedModule,
    NotFoundRoutingModule
  ],
  declarations: [
    NotFoundComponent
  ]
})
export class NotFoundModule { }
