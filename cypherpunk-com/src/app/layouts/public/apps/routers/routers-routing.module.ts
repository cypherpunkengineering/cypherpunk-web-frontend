import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoutersComponent } from './routers.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'apps/routers', component: RoutersComponent }
    ])
  ]
})
export class RoutersRoutingModule { }
