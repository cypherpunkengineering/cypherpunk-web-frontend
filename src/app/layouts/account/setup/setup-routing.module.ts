import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SetupComponent } from './setup.component';
import { AuthGuard } from '../../../services/auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'account/setup',
        component: SetupComponent,
        canActivate: [AuthGuard]
      }
    ])
  ]
})
export class SetupRoutingModule { }
