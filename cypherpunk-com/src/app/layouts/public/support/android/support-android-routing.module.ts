import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SupportAndroidComponent } from './support-android.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'support/android', component: SupportAndroidComponent }
    ])
  ]
})
export class SupportAndroidRoutingModule { }
