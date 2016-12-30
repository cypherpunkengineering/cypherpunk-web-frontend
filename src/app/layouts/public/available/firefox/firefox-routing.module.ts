import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FirefoxComponent } from './firefox.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'firefox', component: FirefoxComponent }
    ])
  ]
})
export class FirefoxRoutingModule { }
