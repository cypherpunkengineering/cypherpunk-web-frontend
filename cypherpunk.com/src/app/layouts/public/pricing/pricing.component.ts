import { Router } from '@angular/router';
import { RequestOptions} from '@angular/http';
import { isBrowser } from 'angular2-universal';
import { Component, NgZone } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { PlansService } from '../../../services/plans.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import 'rxjs/add/operator/toPromise';
import country_list from './countries';

@Component({
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {
  posData: string = '';
  ccButtonDisabled: boolean = false;
  ppButtonDisabled: boolean = false;
  amButtonDisabled: boolean = false;
  bpButtonDisabled: boolean = false;
  disableAccountInfo: boolean = false;
  loading: boolean = false;
  modal = { show: false, header: '', body: '', link: false };
  countries = country_list;
  errHeader: string = 'Error processing your payment';
  errBody: string = 'Please check your payment information and try again.';

  // user variables
  email: string;
  password: string;
  userId: string;

  // Stripe variables
  stripeFormData = {
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    country: '',
    zipCode: '',
    form: { valid: false }
  };

  // Amazon variables
  billingAgreementId: string;
  amazonWallet: any;
  amazonRecurring: any;

  // bitpay variables
  showBTC: boolean = false;

  validCCEmail: boolean = false;
  validCCPass: boolean = false;
  ccEmailTouched: boolean = false;
  ccPassTouched: boolean = false;

  // payment options (cc, a, pp, bc)
  selectedOption = 'cc';

  constructor(
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private authGuard: AuthGuard,
    private backend: BackendService,
    private session: SessionService,
    private alertService: AlertService,
    private plansService: PlansService
  ) {
    // redirect if user is already logged in
    if (isBrowser) {
      this.authGuard.shouldUpgrade()
      .then(() => {
        let redirect = true;
        let type = session.user.account.type;
        let renewal = session.user.subscription.renewal;
        if (type === 'free') { redirect = false; }
        else if (type === 'premium') {
          if (renewal !== 'annually' && renewal !== 'forever') { redirect = false; }
        }
        if (redirect) { router.navigate(['/account/upgrade']); }
        else { router.navigate(['/account']); }
      })
      .catch(() => { });
    }

    // load stripe js files
    if (isBrowser) {
      if (!document.getElementById('stripe-init')) {
        let stripeInit = document.createElement('script');
        stripeInit.setAttribute('id', 'stripe-init');
        stripeInit.setAttribute('type', 'text/javascript');
        stripeInit.innerHTML = `
          window.stripeOnload = function() {
            Stripe.setPublishableKey('pk_test_V8lLSY93CP6w9SFgqCmw8FUg');
          }
        `;
        document.body.appendChild(stripeInit);
      }

      if (!document.getElementById('stripe-v2')) {
        let stripe = document.createElement('script');
        stripe.setAttribute('id', 'stripe-v2');
        stripe.setAttribute('type', 'text/javascript');
        stripe.setAttribute('onload', 'stripeOnload()');
        stripe.setAttribute('src', 'https://js.stripe.com/v2/');
        document.body.appendChild(stripe);
      }
    }

    // load amazon js files
    if (isBrowser) {
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

    // use Geo-IP to preload CC country
    if (isBrowser) {
      backend.networkStatus()
      .subscribe((data: any) => {
        if (data.country === 'ZZ') { return; }

        this.countries.map((country) => {
          if (country.code === data.country) {
            this.stripeFormData.country = country.name;
          }
        });
      });
    }
  }

  // pay with credit card

  getToken() {
    // show loading overlay
    this.loading = true;
    this.ccButtonDisabled = true;
    this.disableAccountInfo = true;

    let month: number;
    let year: number;

    month = Number(this.stripeFormData.expiryDate.split('/')[0]);
    year = Number(this.stripeFormData.expiryDate.split('/')[1]);

    // stripe params
    let stripeParams = {
      name: this.stripeFormData.name,
      number: this.stripeFormData.cardNumber,
      exp_month: month,
      exp_year: year,
      cvc: this.stripeFormData.cvc,
      address_zip: this.stripeFormData.zipCode,
      address_country: this.stripeFormData.country
    };
    if (!this.stripeFormData.zipCode) { delete stripeParams.address_zip; }

    // stripe callback
    let stripeCallback = (status: number, response: any) => {
      if (response.error) {
        this.zone.run(() => {
          this.loading = false;
          this.disableAccountInfo = false;
          this.alertService.error('Could not process payment: ' + response.error.message);
        });
      }
      else {
        let token = response.id;
        return this.saveToServer(token);
      }
    };

    // load up stripe and create token
    let stripe = (<any>window).Stripe;
    stripe.card.createToken(stripeParams, stripeCallback);
  }

  saveToServer(token: string) {
    // call server at this point (using promises)
    let body = {
      token: token,
      plan: this.plansService.selectedPlan.id,
      email: this.email,
      password: this.password
    };
    let options = new RequestOptions({});

    // sets cookie
    return this.backend.stripeCharge(body, options)
    // set user session
    .then((data) => {
      this.session.setUserData({
        account: { email: data.account.email },
        secret: data.secret
      });
    })
    // turn on authed
    .then(() => { this.auth.authed = true; })
    // alert and redirect
    .then(() => {
      this.alertService.success('You account was created!');
      this.router.navigate(['/account']);
    })
    // handle errors
    .catch((error) => {
      this.zone.run(() => {
        this.loading = false;
        this.ccButtonDisabled = false;

        this.modal.header = this.errHeader;
        this.modal.body = error.message;
        this.modal.link = false;
        this.modal.show = true;
      });
    });
  }

  // pay with paypal

  payWithPaypal() {
    this.loading = true;
    this.ppButtonDisabled = true;
    this.disableAccountInfo = true;

    // call server at this point (using promises)
    let body = { email: this.email, password: this.password };
    let options = new RequestOptions({});
    // sets cookie
    return this.backend.createAccount(body, options)
    // set user session
    .then((data) => {
      this.userId = data.account.id;
      this.session.setUserData({
        account: { email: data.account.email },
        secret: data.secret
      });
    })
    // turn on authed
    .then(() => { this.auth.authed = true; })
    // alert and redirect to paypal
    .then(() => {
      this.alertService.success('You account was created!');
    })
    .then(() => {
      if (this.plansService.selectedPlan.id === 'monthly1295') {
        document.getElementById('paypalMonthly').click();
      }
      else if (this.plansService.selectedPlan.id === 'annually9995') {
        document.getElementById('paypalAnnual').click();
      }
      else if (this.plansService.selectedPlan.id === 'semiannually5995') {
        document.getElementById('paypalSemiannual').click();
      }
    })
    // handle errors
    .catch((error) => {
      this.zone.run(() => {
        this.loading = false;
        this.ppButtonDisabled = false;

        this.modal.header = this.errHeader;
        this.modal.body = error.message;
        this.modal.link = false;
        this.modal.show = true;
      });
    });
  }

  // pay with amazon

  amazonInit() {
    let amazon = (<any>window).amazon;
    let OffAmazonPayments = (<any>window).OffAmazonPayments;

    OffAmazonPayments.Button(
      'AmazonPayButton',
      'A2FF2JPNM9GYDJ', {
        type:  'PwA',
        color: 'Gold',
        size:  'medium',
        authorization: () => {
          amazon.Login.authorize({ scope: 'profile', popup: 'true' });
          this.zone.run(() => { this.amazonCreateWallet(); });
        },
        onError: (error) => { console.log(error); }
      }
    );
  }

  amazonCreateWallet() {
    let OffAmazonPayments = (<any>window).OffAmazonPayments;
    document.getElementById('walletWidgetDiv').style.display = 'block';

    if (!this.amazonWallet) {
      new OffAmazonPayments.Widgets.Wallet({
        sellerId: 'A2FF2JPNM9GYDJ',
        onReady: (billingAgreement) => {
          this.billingAgreementId = billingAgreement.getAmazonBillingAgreementId();
        },
        agreementType: 'BillingAgreement',
        design: { designMode: 'responsive' },
        onPaymentSelect: (billingAgreement) => {
          this.zone.run(() => { this.amazonCreateRecurring(); });
        },
        onError: (error) => { console.log(error); }
      }).bind('walletWidgetDiv');
    }
  }

  amazonCreateRecurring () {
    let OffAmazonPayments = (<any>window).OffAmazonPayments;
    document.getElementById('consentWidgetDiv').style.display = 'block';

    if (!this.amazonRecurring) {
      new OffAmazonPayments.Widgets.Consent({
        sellerId: 'A2FF2JPNM9GYDJ',
        // amazonBillingAgreementId obtained from the Amazon Address Book widget.
        amazonBillingAgreementId: this.billingAgreementId,
        design: { designMode: 'responsive' },
        // Called after widget renders
        onReady: (billingAgreementConsentStatus) => {
          let getStatus = billingAgreementConsentStatus.getConsentStatus;
          if (getStatus && getStatus() === 'true') {
            document.getElementById('payWithAmazon').style.display = 'inline';
          }
        },
        onConsent: (billingAgreementConsentStatus) => {
          if (billingAgreementConsentStatus.getConsentStatus() === 'true') {
            document.getElementById('payWithAmazon').style.display = 'inline';
          }
          else {
            window.alert('Please allow for future payments to join Cypherpunk.');
            document.getElementById('payWithAmazon').style.display = 'none';
          }
        },
        onError: (error) => { console.log(error); }
      }).bind('consentWidgetDiv');
    }
  }

  amazonButton() {
    this.loading = true;
    this.amButtonDisabled = true;
    this.disableAccountInfo = true;

    /* send billingAgreement to server */
    let options = new RequestOptions({});
    let body = {
      AmazonBillingAgreementId: this.billingAgreementId,
      plan: this.plansService.selectedPlan.id,
      email: this.email,
      password: this.password
    };

    // sets cookie
    return this.backend.amazonCharge(body, options)
    // set user session
    .then((data) => {
      this.session.setUserData({
        account: { email: data.account.email },
        secret: data.secret
      });
    })
    // turn on authed
    .then(() => { this.auth.authed = true; })
    // alert and redirect
    .then(() => {
      this.alertService.success('You account was created!');
      this.router.navigate(['/account']);
    })
    // handle errors
    .catch((error) => {
      this.zone.run(() => {
        this.loading = false;
        this.amButtonDisabled = false;

        this.modal.header = this.errHeader;
        this.modal.body = error.message;
        this.modal.link = false;
        this.modal.show = true;
      });
    });
  }

  // pay with bitpay

  payWithBitpay() {
    this.loading = true;
    this.bpButtonDisabled = true;
    this.disableAccountInfo = true;

    let body = { email: this.email, password: this.password};
    let options = new RequestOptions({});

    // sets cookie
    return this.backend.createAccount(body, options)
    // set user session
    .then((data) => {
      this.userId = data.account.id;
      this.session.setUserData({
        account: { email: data.account.email },
        secret: data.secret
      });
    })
    // turn on authed
    .then(() => { this.auth.authed = true; })
    .then(() => { this.alertService.success('You account was created!'); })
    .then(() => {
      let posId = {
        id: this.userId,
        plan: this.plansService.selectedPlan.id
      };
      this.posData = JSON.stringify(posId);
    })
    .then(() => {
      if (this.plansService.selectedPlan.id === 'monthly1295') {
        document.getElementById('bitpayMonthly').click();
      }
      else if (this.plansService.selectedPlan.id === 'annually9995') {
        document.getElementById('bitpayAnnual').click();
      }
      else if (this.plansService.selectedPlan.id === 'semiannually5995') {
        document.getElementById('bitpaySemiannual').click();
      }
    })
    // handle errors
    .catch((error) => {
      this.zone.run(() => {
        this.loading = false;
        this.bpButtonDisabled = false;

        this.modal.header = this.errHeader;
        this.modal.body = error.message;
        this.modal.link = false;
        this.modal.show = true;
      });
    });
  }

  // validation functions

  validateCCEmail(onBlur: boolean) {
    this.ccEmailTouched = true;

    if (!this.email) { this.validCCEmail = false; }
    else if (!/^\S+@\S+$/.test(this.email)) { this.validCCEmail = false; }
    else { this.validCCEmail = true; }

    if (onBlur && this.validCCEmail) {
      let body = { email: this.email };
      let options = new RequestOptions({});
      this.backend.identifyEmail(body, options)
      .then(() => {
        this.modal.header = 'It looks like you\'re already a Cypherpunk!';
        this.modal.body = `Why not upgrade your account here: `;
        this.modal.link = true;
        this.modal.show = true;
      })
      .catch((data) => {
        if (data.status === 401) { this.validCCEmail = true; }
        else { this.validCCEmail = false; }
      });
    }

    return this.validCCEmail;
  }

  validateCCPass() {
    this.ccPassTouched = true;

    if (!this.password) { this.validCCPass = false; }
    else { this.validCCPass = true; }
    return this.validCCPass;
  }

  validatePP() {
    return this.validCCEmail && this.ccEmailTouched &&
    this.validCCPass && this.ccPassTouched;
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // option functions

  selectOption(option) {
    this.selectedOption = option;

    // launch amazon payments
    if (this.selectedOption === 'a') {
      this.showBTC = false;
      setTimeout(() => { this.amazonInit(); }, 100);
    }
    else if (this.selectedOption === 'bc') { this.showBTC = true; }
    else { this.showBTC = false; }
  }

}
