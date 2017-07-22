import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmComponent } from './confirm.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'confirm', component: ConfirmComponent },
      { path: 'confirmation', component: ConfirmComponent }
    ])
  ]
})
export class ConfirmRoutingModule { }
