import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WindowsComponent } from './windows.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'apps/windows', component: WindowsComponent },
      { path: 'apps/windows/autostart', component: WindowsComponent }
    ])
  ]
})
export class WindowsRoutingModule { }
