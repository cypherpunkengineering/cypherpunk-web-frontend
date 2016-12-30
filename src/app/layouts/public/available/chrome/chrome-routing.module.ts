import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChromeComponent } from './chrome.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'chrome', component: ChromeComponent }
    ])
  ]
})
export class ChromeRoutingModule { }
