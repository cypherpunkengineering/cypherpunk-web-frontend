import { NgModule } from '@angular/core';
import { ConfigGeneratorComponent } from './config-generator.component';
import { SharedModule } from '../../../../components/shared/shared.module';
import { ConfigGeneratorRoutingModule } from './config-generator-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ConfigGeneratorRoutingModule
  ],
  declarations: [
    ConfigGeneratorComponent
  ]
})
export class ConfigGeneratorModule { }
