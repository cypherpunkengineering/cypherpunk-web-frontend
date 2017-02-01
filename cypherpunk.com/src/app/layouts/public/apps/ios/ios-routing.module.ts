import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IosComponent } from './ios.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'apps/ios', component: IosComponent }
    ])
  ]
})
export class IosRoutingModule { }