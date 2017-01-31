import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LinuxComponent } from './linux.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'apps/linux', component: LinuxComponent }
    ])
  ]
})
export class LinuxRoutingModule { }
