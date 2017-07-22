import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManifestoComponent } from './manifesto.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'about/manifesto', component: ManifestoComponent }
    ])
  ]
})
export class ManifestoRoutingModule { }
