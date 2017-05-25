import { NgModule } from '@angular/core';
import { MacComponent } from './mac.component';
import { MacRoutingModule } from './mac-routing.module';
import { AppsSharedModule } from '../apps-shared.module';

@NgModule({
  imports: [
    AppsSharedModule,
    MacRoutingModule
  ],
  declarations: [
    MacComponent
  ]
})
export class MacModule { }
