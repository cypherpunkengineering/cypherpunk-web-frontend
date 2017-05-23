import { NgModule } from '@angular/core';
import { HostnameSelectorComponent } from './hostname-selector.component';
import { SharedModule } from '../../../../components/shared/shared.module';
import { HostnameSelectorRoutingModule } from './hostname-selector-routing.module';

@NgModule({
  imports: [
    SharedModule,
    HostnameSelectorRoutingModule
  ],
  declarations: [
    HostnameSelectorComponent
  ]
})
export class HostnameSelectorModule { }
