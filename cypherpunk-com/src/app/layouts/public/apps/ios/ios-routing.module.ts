import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IosComponent } from './ios.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'apps/ios', component: IosComponent },
      { path: 'apps/ios/autostart', component: IosComponent }
    ])
  ]
})
export class IosRoutingModule { }
