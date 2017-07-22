import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WhoComponent } from './who.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'about/who-we-are', component: WhoComponent }
    ])
  ]
})
export class WhoRoutingModule { }
