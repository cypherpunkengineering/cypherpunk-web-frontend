import { Router } from '@angular/router';
import { RequestOptions} from '@angular/http';
import { isBrowser } from 'angular2-universal';
import { DOCUMENT } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { PlansService } from '../../../services/plans.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import { Component, Inject, NgZone, ViewChild } from '@angular/core';
import country_list from './countries';

@Component({
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {
  @ViewChild('accounts') accountChild;
  @ViewChild('amazon') amazon;
  @ViewChild('paypal') paypal;
  @ViewChild('bitpay') bitpay;

  // payment options (cc, a, pp, bc)
  paymentMethod = '';
  countries = country_list;
  loading: boolean = false;
  disablePayment: boolean = false;
  modal = { show: false, header: '', body: '', link: false };
  errHeader: string = 'Error processing your payment';

  // user variables
  accountFormData = {
    email: '',
    password: '',
    validation: {
      email: false,
      warning: false,
      disabled: false
    },
    form: { valid: false }
  };

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
  amazonHide: boolean = false;

  // bitpay variables
  showBTC: boolean = false;

  // Paypayl variables
  userId: string;

  constructor(
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private authGuard: AuthGuard,
    private backend: BackendService,
    private session: SessionService,
    private alertService: AlertService,
    private plansService: PlansService,
    @Inject(DOCUMENT) private document: any
  ) {
    // handle title
    this.document.title = 'Cypherpunk Privacy & VPN Pricing and Order Form';

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
        else if (type !== 'premium') { redirect = false; }

        history.replaceState({}, document.title, document.location.origin);
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

  // pay with stripe

  getToken() {
    // show loading overlay
    this.loading = true;
    this.disablePayment = true;
    this.accountChild.disableInputs();

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
      email: this.accountFormData.email,
      password: this.accountFormData.password
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
    .catch(error => { this.handleError(error); });
  }

  // pay with paypal

  payWithPaypal() {
    this.loading = true;
    this.disablePayment = true;
    this.accountChild.disableInputs();

    return this.createAccount()
    .then(() => { this.paypal.pay(this.plansService.selectedPlan.id); })
    .catch(error => { this.handleError(error); });
  }

  // pay with amazon

  updateBillingId(billingId) {
    this.billingAgreementId = billingId;
  }

  updateAmazonHide(amazonHide) {
    this.amazonHide = amazonHide;
  }

  payWithAmazon() {
    this.loading = true;
    this.disablePayment = true;
    this.accountChild.disableInputs();

    /* send billingAgreement to server */
    let body = {
      AmazonBillingAgreementId: this.billingAgreementId,
      plan: this.plansService.selectedPlan.id,
      email: this.accountFormData.email,
      password: this.accountFormData.password
    };

    // sets cookie
    return this.backend.amazonCharge(body, {})
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
    .catch(error => { this.handleError(error); });
  }

  // pay with bitpay

  payWithBitpay() {
    this.loading = true;
    this.disablePayment = true;
    this.accountChild.disableInputs();

    return this.createAccount()
    .then(() => { this.bitpay.pay(this.plansService.selectedPlan.id); })
    .catch(error => { this.handleError(error); });
  }

  // helper functions

  createAccount(): Promise<void> {
    // sets cookie
    let body = { email: this.accountFormData.email, password: this.accountFormData.password };
    return this.backend.createAccount(body, {})
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
    .then(() => { this.alertService.success('You account was created!'); });
  }

  handleError(error) {
    this.zone.run(() => {
      this.loading = false;
      this.disablePayment = false;

      this.modal.header = this.errHeader;
      this.modal.body = error.message;
      this.modal.link = false;
      this.modal.show = true;
    });
  }

  selectOption(method) {
    this.paymentMethod = method;
    // launch amazon payments
    if (method === 'a') {
      this.showBTC = false;
      setTimeout(() => { this.amazon.init(); }, 100);
    }
    else if (method === 'bc') { this.showBTC = true; }
    else { this.showBTC = false; }
  }

}
