import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FirefoxPartialComponent } from './firefox.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'partial/firefox', component: FirefoxPartialComponent },
    ])
  ]
})
export class FirefoxPartialRoutingModule { }
