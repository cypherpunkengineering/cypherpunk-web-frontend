import { NgModule } from '@angular/core';
import { AppsComponent } from './apps.component';
import { AppsSharedModule } from '../apps-shared.module';
import { AppsRoutingModule } from './apps-routing.module';

@NgModule({
  imports: [
    AppsSharedModule,
    AppsRoutingModule
  ],
  declarations: [
    AppsComponent
  ]
})
export class AppsModule { }
