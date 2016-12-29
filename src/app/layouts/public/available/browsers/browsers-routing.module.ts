import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowsersComponent } from './browsers.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'browsers', component: BrowsersComponent }
    ])
  ]
})
export class BrowsersRoutingModule { }
