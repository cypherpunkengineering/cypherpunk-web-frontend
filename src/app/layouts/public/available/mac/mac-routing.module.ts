import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MacComponent } from './mac.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'mac', component: MacComponent }
    ])
  ]
})
export class MacRoutingModule { }
