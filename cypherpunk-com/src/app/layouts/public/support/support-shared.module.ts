import { RouterModule } from '@angular/router';
import { CommonModule }   from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupportNavigationComponent } from './support-navigation/support-navigation.component';

const MODULES = [
  // Do NOT include UniversalModule, HttpModule, or JsonpModule here
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule
];

const PIPES = [
  // put pipes here
];

const COMPONENTS = [
  // put shared components here
  SupportNavigationComponent
];

const PROVIDERS = [];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...PIPES,
    ...COMPONENTS
  ],
  providers: [
  ],
  exports: [
    ...MODULES,
    ...PIPES,
    ...COMPONENTS
  ]
})
export class SupportSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SupportSharedModule,
      providers: [
        ...PROVIDERS
      ]
    };
  }
}
