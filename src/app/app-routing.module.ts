import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'home', redirectTo: '/', pathMatch: 'full' }
    ])
  ],
})
export class AppRoutingModule { }
