import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HostnameSelectorComponent } from './hostname-selector.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'partial/hostname', component: HostnameSelectorComponent },
    ])
  ]
})
export class HostnameSelectorRoutingModule { }
