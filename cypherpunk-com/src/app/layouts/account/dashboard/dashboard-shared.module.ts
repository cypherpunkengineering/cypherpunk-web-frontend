import { RouterModule } from '@angular/router';
import { CommonModule }   from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../components/shared/shared.module';
import { AccountReferComponent } from './components/refer/refer.component';
import { AccountIssueComponent } from './components/issue/issue.component';
import { AccountBillingComponent } from './components/billing/billing.component';
import { AccountPaymentComponent } from './components/payment/payment.component';
import { AccountConfigsComponent } from './components/configs/configs.component';
import { AccountOverviewComponent } from './components/overview/overview.component';
import { AccountSubscriptionComponent } from './components/subscription/subscription.component';

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
  AccountIssueComponent,
  AccountBillingComponent,
  AccountPaymentComponent,
  AccountSubscriptionComponent,
  AccountOverviewComponent,
  AccountReferComponent,
  AccountConfigsComponent
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
export class DashboardSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DashboardSharedModule,
      providers: [
        ...PROVIDERS
      ]
    };
  }
}
