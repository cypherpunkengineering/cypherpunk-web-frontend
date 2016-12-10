import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupComponent } from './setup.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'account/setup',
        component: SetupComponent
      }
    ])
  ]
})
export class SetupRoutingModule { }
