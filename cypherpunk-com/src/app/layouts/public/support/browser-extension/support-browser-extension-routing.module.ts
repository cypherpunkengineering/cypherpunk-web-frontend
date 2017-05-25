import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SupportBrowserExtensionComponent } from './support-browser-extension.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'support/browser-extension', component: SupportBrowserExtensionComponent }
    ])
  ]
})
export class SupportBrowserExtensionRoutingModule { }
