import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { AboutusComponent } from './aboutus.component';
import { AboutusRoutingModule } from './aboutus-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AboutusRoutingModule
  ],
  declarations: [
    AboutusComponent
  ]
})
export class AboutusModule { }
