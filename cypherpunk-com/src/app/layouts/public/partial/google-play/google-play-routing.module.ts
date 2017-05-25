import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GooglePlayPartialComponent } from './google-play.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'partial/google-play', component: GooglePlayPartialComponent },
    ])
  ]
})
export class GooglePlayPartialRoutingModule { }
