import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutusComponent } from './aboutus.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'about/who-we-are', component: AboutusComponent }
    ])
  ]
})
export class AboutusRoutingModule { }
