import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportBrowserExtensionComponent } from './support-browser-extension.component';
import { SupportBrowserExtensionRoutingModule } from './support-browser-extension-routing.module';

@NgModule({
  imports: [
    SupportSharedModule,
    SupportBrowserExtensionRoutingModule
  ],
  declarations: [
    SupportBrowserExtensionComponent
  ]
})
export class SupportBrowserExtensionModule { }
