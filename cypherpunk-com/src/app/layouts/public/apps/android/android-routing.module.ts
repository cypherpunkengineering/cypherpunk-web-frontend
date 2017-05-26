import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AndroidComponent } from './android.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'apps/android', component: AndroidComponent },
      { path: 'apps/android/autostart', component: AndroidComponent }
    ])
  ]
})
export class AndroidRoutingModule { }
