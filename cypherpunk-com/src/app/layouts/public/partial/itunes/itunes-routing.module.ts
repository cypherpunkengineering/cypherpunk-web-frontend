import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItunesPartialComponent } from './itunes.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'partial/itunes', component: ItunesPartialComponent },
    ])
  ]
})
export class ItunesPartialRoutingModule { }
