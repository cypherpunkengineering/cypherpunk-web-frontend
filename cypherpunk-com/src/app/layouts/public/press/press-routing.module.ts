import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PressComponent } from './press.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'press', component: PressComponent },
    ])
  ]
})
export class PressRoutingModule { }
