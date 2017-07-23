import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LicenseDesktopComponent } from './license-desktop.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'legal/license/desktop', component: LicenseDesktopComponent }
    ])
  ]
})
export class LicenseDesktopRoutingModule { }
