import { NgModule } from '@angular/core';
import { CertComponent } from './cert.component';
import { CertRoutingModule } from './cert-routing.module';
import { SharedModule } from '../../../../components/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CertRoutingModule
  ],
  declarations: [
    CertComponent
  ]
})
export class CertModule { }
