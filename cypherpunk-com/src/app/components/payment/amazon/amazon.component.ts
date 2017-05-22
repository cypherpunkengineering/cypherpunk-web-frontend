import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
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

  constructor(
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // load amazon script
    if (isPlatformBrowser(this.platformId)) {
      if (!document.getElementById('amazon-init')) {
        let amazonInit = document.createElement('script');
        amazonInit.setAttribute('id', 'amazon-init');
        amazonInit.setAttribute('type', 'text/javascript');
        amazonInit.innerHTML = `
          window.onAmazonLoginReady = function() {
            var cid = 'amzn1.application-oa2-client.ecc2bfbfc6fa421b973018ecb6f4bc36';
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
        amazon.setAttribute('src', 'https://static-na.payments-amazon.com/OffAmazonPayments/us/sandbox/js/Widgets.js');
        document.body.appendChild(amazon);
      }
    }
  }

  init() {
    let amazon = (<any>window).amazon;
    let OffAmazonPayments = (<any>window).OffAmazonPayments;

    OffAmazonPayments.Button(
      'AmazonPayButton',
      'A2FF2JPNM9GYDJ', {
        type:  'PwA',
        color: 'Gold',
        size:  'medium',
        authorization: () => {
          amazon.Login.setSandboxMode(true);
          amazon.Login.authorize({ scope: 'profile', popup: 'true' });
          this.zone.run(() => { this.createWallet(); });
        },
        onError: (error) => { console.log(error); }
      }
    );
  }

  launchAmazon() {
    let amazon = (<any>window).amazon;
    amazon.Login.setSandboxMode(true);
    amazon.Login.authorize({ scope: 'profile', popup: 'true' });
    this.zone.run(() => { this.createWallet(); });
  }

  createWallet() {
    let OffAmazonPayments = (<any>window).OffAmazonPayments;

    if (!this.amazonWallet) {
      new OffAmazonPayments.Widgets.Wallet({
        sellerId: 'A2FF2JPNM9GYDJ',
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
        sellerId: 'A2FF2JPNM9GYDJ',
        // amazonBillingAgreementId obtained from the Amazon Address Book widget.
        amazonBillingAgreementId: this.billingAgreementId,
        design: { designMode: 'responsive' },
        // Called after widget renders
        onReady: (billingAgreementConsentStatus) => {
          let getStatus = billingAgreementConsentStatus.getConsentStatus;
          document.getElementById('consentWidgetDiv').style.display = 'block';
          if (getStatus && getStatus() === 'true') {
            this.updateAmazonRecurringEnabled.emit(true);
          }
          else { this.updateAmazonRecurringEnabled.emit(false); }
        },
        onConsent: (billingAgreementConsentStatus) => {
          this.zone.run(() => {
            if (billingAgreementConsentStatus.getConsentStatus() === 'true') {
              this.updateAmazonRecurringEnabled.emit(true);
            }
            else { this.updateAmazonRecurringEnabled.emit(false); }
          });
        },
        onError: (error) => { console.log(error); }
      }).bind('consentWidgetDiv');
    }
  }

}
