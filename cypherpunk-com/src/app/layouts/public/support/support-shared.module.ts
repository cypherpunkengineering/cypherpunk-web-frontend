import { RouterModule } from '@angular/router';
import { CommonModule }   from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../components/shared/shared.module';
import { SearchContactComponent } from './components/search-contact/search-contact.component';

const MODULES = [
  // Do NOT include UniversalModule, HttpModule, or JsonpModule here
  CommonModule,
  RouterModule,
  FormsModule,
  SharedModule,
  ReactiveFormsModule
];

const PIPES = [
  // put pipes here
];

const COMPONENTS = [
  // put shared components here
  SearchContactComponent
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
