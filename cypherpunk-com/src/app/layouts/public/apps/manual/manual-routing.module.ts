import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManualComponent } from './manual.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'apps/manual', component: ManualComponent }
    ])
  ]
})
export class ManualRoutingModule { }
