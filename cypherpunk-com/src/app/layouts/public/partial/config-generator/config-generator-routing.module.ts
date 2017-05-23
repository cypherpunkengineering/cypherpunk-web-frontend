import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigGeneratorComponent } from './config-generator.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'partial/config-generator', component: ConfigGeneratorComponent },
    ])
  ]
})
export class ConfigGeneratorRoutingModule { }
