import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmChangeComponent } from './confirm-change.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'confirmChange',
        component: ConfirmChangeComponent
      }
    ])
  ]
})
export class ConfirmChangeRoutingModule { }
