import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MacComponent } from './mac.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'apps/mac', component: MacComponent },
      { path: 'apps/mac/autostart', component: MacComponent },
      { path: 'apps/mac/download', component: MacComponent },
      { path: 'apps/macos', component: MacComponent },
      { path: 'apps/macos/autostart', component: MacComponent },
      { path: 'apps/macos/download', component: MacComponent }
    ])
  ]
})
export class MacRoutingModule { }
