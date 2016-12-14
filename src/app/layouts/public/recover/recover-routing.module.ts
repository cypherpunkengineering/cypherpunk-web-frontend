import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RecoverComponent } from './recover.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'recover', component: RecoverComponent }
    ])
  ]
})
export class RecoverRoutingModule { }
