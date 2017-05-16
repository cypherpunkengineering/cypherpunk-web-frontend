import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SupportWindowsComponent } from './support-windows.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'support/windows', component: SupportWindowsComponent }
    ])
  ]
})
export class SupportWindowsRoutingModule { }
