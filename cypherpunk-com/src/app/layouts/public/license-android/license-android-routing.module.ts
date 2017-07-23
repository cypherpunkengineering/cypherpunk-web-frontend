import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LicenseAndroidComponent } from './license-android.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'legal/license/android', component: LicenseAndroidComponent }
    ])
  ]
})
export class LicenseAndroidRoutingModule { }
