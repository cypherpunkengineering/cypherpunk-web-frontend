import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountNavigationComponent } from '../account-navigation/account-navigation.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { AlertComponent } from '../alert/alert.component';
import { FooterComponent } from '../footer/footer.component';
import { LoadingComponent } from '../loading/loading.component';
import { NoScriptComponent } from '../noscript/noscript.component';
import { PriceBoxesComponent } from '../payment/price-boxes/price-boxes.component';
import { AmazonComponent } from '../payment/amazon/amazon.component';
import { PaypalComponent } from '../payment/paypal/paypal.component';
import { BitpayComponent } from '../payment/bitpay/bitpay.component';
import { StripeCCFormComponent } from '../forms/stripe-cc-form/stripe-cc-form.component';
import { AccountCreationFormComponent } from '../forms/account-creation-form/account-creation-form.component';
import { PaymentSelectionComponent } from '../payment/payment-selection/payment-selection.component';
import { CCNumberPipe } from '../../pipes/cc-number.pipe';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { ContactFromComponent } from '../contact-form/contact-form.component';
import { SetupHostnameComponent } from '../setup/setup-hostname/setup-hostname.component';
import { SetupCredentialsComponent } from '../setup/setup-credentials/setup-credentials.component';
import { SetupCertComponent } from '../setup/setup-cert/setup-cert.component';
import { SetupGeneratorComponent } from '../setup/setup-generator/setup-generator.component';

const MODULES = [
  // Do NOT include UniversalModule, HttpModule, or JsonpModule here
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule
];

const PIPES = [
  // put pipes here
  CCNumberPipe,
  SafeHtmlPipe
];

const COMPONENTS = [
  // put shared components here
  AccountNavigationComponent,
  NavigationComponent,
  AlertComponent,
  FooterComponent,
  LoadingComponent,
  AmazonComponent,
  PaypalComponent,
  BitpayComponent,
  PriceBoxesComponent,
  NoScriptComponent,
  StripeCCFormComponent,
  AccountCreationFormComponent,
  PaymentSelectionComponent,
  ContactFromComponent,
  SetupHostnameComponent,
  SetupCredentialsComponent,
  SetupCertComponent,
  SetupGeneratorComponent
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
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ...PROVIDERS
      ]
    };
  }
}
