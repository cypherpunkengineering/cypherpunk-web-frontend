import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppsComponent } from './apps.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'apps', component: AppsComponent }
    ])
  ]
})
export class AppsRoutingModule { }
