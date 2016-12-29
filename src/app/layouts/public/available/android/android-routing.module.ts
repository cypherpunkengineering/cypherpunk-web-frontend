import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AndroidComponent } from './android.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'android', component: AndroidComponent }
    ])
  ]
})
export class AndroidRoutingModule { }
