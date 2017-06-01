import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupportRoutersComponent } from './support-routers.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'support/routers', component: SupportRoutersComponent }
    ])
  ]
})
export class SupportRoutersRoutingModule { }
