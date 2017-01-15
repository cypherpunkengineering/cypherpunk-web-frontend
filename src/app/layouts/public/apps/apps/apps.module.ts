import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../components/shared/shared.module';
import { AppsComponent } from './apps.component';
import { AppsRoutingModule } from './apps-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AppsRoutingModule
  ],
  declarations: [
    AppsComponent
  ]
})
export class AppsModule { }
