import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NotFoundComponent } from './notfound.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '404', component: NotFoundComponent }
    ])
  ]
})
export class NotFoundRoutingModule { }
