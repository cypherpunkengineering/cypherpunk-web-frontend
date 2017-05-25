import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AmazonAppStorePartialComponent } from './amazon-app-store.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'partial/amazon-app-store', component: AmazonAppStorePartialComponent },
    ])
  ]
})
export class AmazonAppStorePartialRoutingModule { }
