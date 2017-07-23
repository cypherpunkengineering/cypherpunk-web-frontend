import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { LicenseDesktopComponent } from './license-desktop.component';
import { LicenseDesktopRoutingModule } from './license-desktop-routing.module';

@NgModule({
  imports: [
    SharedModule,
    LicenseDesktopRoutingModule
  ],
  declarations: [
    LicenseDesktopComponent
  ]
})
export class LicenseDesktopModule { }
