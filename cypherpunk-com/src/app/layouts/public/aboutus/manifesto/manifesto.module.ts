import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../components/shared/shared.module';
import { ManifestoComponent } from './manifesto.component';
import { ManifestoRoutingModule } from './manifesto-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ManifestoRoutingModule
  ],
  declarations: [
    ManifestoComponent
  ]
})
export class ManifestoModule { }
