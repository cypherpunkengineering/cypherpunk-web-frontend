import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupportOthersComponent } from './support-others.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'support/embedded-devices', component: SupportOthersComponent }
    ])
  ]
})
export class SupportOthersRoutingModule { }
