import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChromePartialComponent } from './chrome.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'partial/chrome', component: ChromePartialComponent },
    ])
  ]
})
export class ChromePartialRoutingModule { }
