import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PunksComponent } from './punks.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'about/punks', component: PunksComponent }
    ])
  ]
})
export class PunksRoutingModule { }
