import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserComponent } from './browser.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'apps/browser', component: BrowserComponent }
    ])
  ]
})
export class BrowserRoutingModule { }
