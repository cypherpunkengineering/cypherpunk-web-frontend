import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FactsComponent } from './facts.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'about/facts', component: FactsComponent }
    ])
  ]
})
export class FactsRoutingModule { }
