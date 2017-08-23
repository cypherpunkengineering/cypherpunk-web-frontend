import { NgModule } from '@angular/core';
import { ManualComponent } from './manual.component';
import { AppsSharedModule } from '../apps-shared.module';
import { ManualRoutingModule } from './manual-routing.module';

@NgModule({
  imports: [
    AppsSharedModule,
    ManualRoutingModule
  ],
  declarations: [
    ManualComponent
  ]
})
export class ManualModule { }
