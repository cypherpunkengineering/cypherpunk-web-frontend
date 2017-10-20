import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LicenseIOSComponent } from './license-ios.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'legal/license/ios', component: LicenseIOSComponent }
    ])
  ]
})
export class LicenseIOSRoutingModule { }
