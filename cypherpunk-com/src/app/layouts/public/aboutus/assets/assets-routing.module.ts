import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AssetsComponent } from './assets.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'about/assets', component: AssetsComponent }
    ])
  ]
})
export class AssetsRoutingModule { }
