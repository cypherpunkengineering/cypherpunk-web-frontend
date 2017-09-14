import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GlobalsService } from '../../../services/globals.service';
import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';

@Component({
  selector: 'app-amazon',
  templateUrl: './amazon.component.html',
  styleUrls: ['./amazon.component.css']
})
export class AmazonComponent {
  @Input() disable: boolean;
  @Input() billingAgreementId: string;
  @Output() updateBillingId: EventEmitter<string> = new EventEmitter<string>();
  @Output() updateAmazonHide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateAmazonRecurringEnabled: EventEmitter<boolean> = new EventEmitter<boolean>();

  amazonWallet: any;
  amazonRecurring: any;
  amazonHide = false;
  devSellerId = 'A2FF2JPNM9GYDJ';
  prodSellerId = 'A2FF2JPNM9GYDJ';
  sellerId = this.devSellerId;
  devClientId = 'amzn1.application-oa2-client.ecc2bfbfc6fa421b973018ecb6f4bc36';
  prodClientId = 'amzn1.application-oa2-client.ecc2bfbfc6fa421b973018ecb6f4bc36';
  clientId = this.devClientId;
  devWidgetUrl = 'https://static-na.payments-amazon.com/OffAmazonPayments/us/sandbox/js/Widgets.js';
  prodWidgetUrl = 'https://static-na.payments-amazon.com/OffAmazonPayments/us/js/Widgets.js';
  widgetUrl = this.devWidgetUrl;
  recurringError = false;

  constructor(
    private zone: NgZone,
    private globals: GlobalsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Detect ENV
    if (globals.ENV === 'PROD') {
      this.widgetUrl = this.prodWidgetUrl;
      this.sellerId = this.prodSellerId;
      this.clientId = this.prodClientId;
    }

    // load amazon script
    if (isPlatformBrowser(this.platformId)) {
      if (!document.getElementById('amazon-init')) {
        let amazonInit = document.createElement('script');
        amazonInit.setAttribute('id', 'amazon-init');
        amazonInit.setAttribute('type', 'text/javascript');
        amazonInit.innerHTML = `
          window.onAmazonLoginReady = function() {
            var cid = '${this.clientId}';
            amazon.Login.setClientId(cid);
          };
        `;
        document.body.appendChild(amazonInit);
      }

      if (!document.getElementById('amazon-widget')) {
        let amazon = document.createElement('script');
        amazon.setAttribute('id', 'amazon-widget');
        amazon.setAttribute('type', 'text/javascript');
        amazon.setAttribute('async', 'async');
        amazon.setAttribute('src', this.widgetUrl);
        document.body.appendChild(amazon);
      }
    }
  }

  // called externally from the outside the component
  /// verify that this is still used
  init() {
    let amazon = (<any>window).amazon;
    let OffAmazonPayments = (<any>window).OffAmazonPayments;

    OffAmazonPayments.Button(
      'AmazonPayButton',
      this.sellerId, {
        type:  'PwA',
        color: 'Gold',
        size:  'medium',
        authorization: () => {
          if (this.globals.ENV === 'DEV' || this.globals.ENV === 'STAGING') {
            amazon.Login.setSandboxMode(true);
          }
          else { amazon.Login.setSandboxMode(false); }
          amazon.Login.authorize({ scope: 'profile', popup: 'true' });
          this.zone.run(() => { this.createWallet(); });
        },
        onError: (error) => { console.log(error); }
      }
    );
  }

  setRecurringError() { this.recurringError = true; }

  // called internally in the component
  launchAmazon() {
    let amazon = (<any>window).amazon;
    if (this.globals.ENV === 'DEV' || this.globals.ENV === 'STAGING') {
      amazon.Login.setSandboxMode(true);
    }
    else { amazon.Login.setSandboxMode(false); }
    amazon.Login.authorize({ scope: 'profile', popup: 'true' });
    this.zone.run(() => { this.createWallet(); });
  }

  createWallet() {
    let OffAmazonPayments = (<any>window).OffAmazonPayments;

    if (!this.amazonWallet) {
      new OffAmazonPayments.Widgets.Wallet({
        sellerId: this.sellerId,
        onReady: (billingAgreement) => {
          this.amazonHide = true;
          this.updateAmazonHide.emit(true);
          this.billingAgreementId = billingAgreement.getAmazonBillingAgreementId();
          this.updateBillingId.emit(this.billingAgreementId);
          document.getElementById('walletWidgetDiv').style.display = 'block';
          document.getElementById('payWithAmazon').style.display = 'inline';
        },
        agreementType: 'BillingAgreement',
        design: { designMode: 'responsive' },
        onPaymentSelect: (billingAgreement) => {
          this.zone.run(() => { this.createRecurring(); });
        },
        onError: (error) => { console.log(error); }
      }).bind('walletWidgetDiv');
    }
  }

  createRecurring () {
    let OffAmazonPayments = (<any>window).OffAmazonPayments;

    if (!this.amazonRecurring) {
      new OffAmazonPayments.Widgets.Consent({
        sellerId: this.sellerId,
        // amazonBillingAgreementId obtained from the Amazon Address Book widget.
        amazonBillingAgreementId: this.billingAgreementId,
        design: { designMode: 'responsive' },
        // Called after widget renders
        onReady: (billingAgreementConsentStatus) => {
          let getStatus = billingAgreementConsentStatus.getConsentStatus;
          document.getElementById('consentWidgetDiv').style.display = 'block';
          if (getStatus && getStatus() === 'true') { this.updateAmazonRecurringEnabled.emit(true); }
          else { this.updateAmazonRecurringEnabled.emit(false); }
        },
        onConsent: (billingAgreementConsentStatus) => {
          this.zone.run(() => {
            if (billingAgreementConsentStatus.getConsentStatus() === 'true') {
              this.recurringError = false;
              this.updateAmazonRecurringEnabled.emit(true);
            }
            else {
              this.recurringError = true;
              this.updateAmazonRecurringEnabled.emit(false);
            }
          });
        },
        onError: (error) => { console.log(error); }
      }).bind('consentWidgetDiv');
    }
  }

}
