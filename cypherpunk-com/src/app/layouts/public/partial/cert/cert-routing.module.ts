import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CertComponent } from './cert.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'partial/cert', component: CertComponent },
    ])
  ]
})
export class CertRoutingModule { }
