import { NgModule } from '@angular/core';
import { FactsComponent } from './facts.component';
import { FactsRoutingModule } from './facts-routing.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FactsRoutingModule
  ],
  declarations: [
    FactsComponent
  ]
})
export class FactsModule { }
