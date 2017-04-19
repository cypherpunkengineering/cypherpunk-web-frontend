import { isBrowser } from 'angular2-universal';
import { RequestOptions } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { PlansService } from '../../../services/plans.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import { Component, Inject, NgZone, ViewChild } from '@angular/core';
import country_list from '../../public/pricing/countries';

@Component({
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent {
  @ViewChild('amazon') amazon;
  @ViewChild('paypal') paypal;
  @ViewChild('bitpay') bitpay;

  // payment options (cc, a, pp, bc)
  paymentMethod: string = '';
  countries = country_list;
  loading: boolean = true;
  disablePayment: boolean = false;
  modal = { show: false, header: '', body: '' };
  errHeader: string = 'Error processing your payment';

  // user variables
  email: string;
  userId: string;
  sessionUser;

  // Stripe variables
  cards = [];
  defaultCardId: string = '';
  showCreateCard: boolean = false;
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

  constructor(
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private authGuard: AuthGuard,
    private session: SessionService,
    private backend: BackendService,
    private alertService: AlertService,
    private plansService: PlansService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any
  ) {
    // handle title
    this.document.title = 'Upgrade Cypherpunk Account';

    // check if valid user account
    if (isBrowser) {
      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.authGuard.canActivate(route, state)
      .then((data) => { this.loading = data.loading || false; })
      .then(() => {
        this.email = session.user.account.email;
        this.userId = session.user.account.id;
        let redirect = true;
        let type = session.user.account.type;
        let renewal = session.user.subscription.renewal;
        if (type === 'free') { redirect = false; }
        else if (type === 'premium') {
          if (renewal !== 'annually' && renewal !== 'forever') { redirect = false; }
        }

        if (redirect) {
          history.replaceState({}, document.title, document.location.origin);
          router.navigate(['/account']);
        }
      })
      .catch(() => { /* keep error from showing on console */ });
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
      }, () => {});
    }

    // get all stripe cards for this user
    if (isBrowser) {
      backend.cards()
      .subscribe((data: any) => {
        this.defaultCardId = data.default_source;
        this.cards = data.sources;
        if (!this.cards.length) { this.showCreateCard = true; }
      }, () => {});
    }
  }

  // pay with credit card

  stripeButtonDisabled() {
    if (this.showCreateCard) { return !this.stripeFormData.form.valid || this.disablePayment; }
    else { return !this.defaultCardId || this.disablePayment; }
  }

  stripeUpgrade() {
    if (this.showCreateCard) { this.getToken(); }
    else { this.finalizeDefaultCard(); }
  }

  // stripe upgrade with new card

  getToken() {
    // show loading overlay
    this.loading = true;
    this.disablePayment = true;

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
        return this.createCard(token);
      }
    };

    // load up stripe and create token
    let stripe = (<any>window).Stripe;
    stripe.card.createToken(stripeParams, stripeCallback);
  }

  createCard(token) {
    let body = { token: token };
    let options = new RequestOptions({});
    // set cookie
    return this.backend.createCard(body, options)
    .then((data) => { this.auth.authed = true; return data; })
    // alert and redirect
    .then((data) => {
      this.zone.run(() => {
        this.defaultCardId = data.default_source;
        this.cards = data.sources;
      });
      return this.saveToServer();
    })
    // handle errors
    // error 409 -> redirect to Signin page
    .catch(error => { this.handleError(error); });
  }

  // stripe upgrade with existing card

  setDefaultCard(cardId) { this.defaultCardId = cardId; }

  finalizeDefaultCard() {
    // show loading overlay
    this.loading = true;
    this.disablePayment = true;

    let body = { default_source: this.defaultCardId };
    let options = new RequestOptions({});
    return this.backend.defaultCard(body, options)
    .then((data) => {
      this.defaultCardId = data.default_source;
      this.cards = data.sources;
    })
    .then(() => { return this.saveToServer(); });
  }

  saveToServer() {
    let body = { plan: this.plansService.selectedPlan.id };
    let options = new RequestOptions({});

    // set cookie
    return this.backend.stripeUpgrade(body, options)
    .then(() => { this.auth.authed = true; })
    // alert and redirect
    .then(() => {
      this.zone.run(() => {
        this.loading = false;
        this.alertService.success('You have upgraded your account');
        this.router.navigate(['/account']);
        this.disablePayment = false;
      });
    })
    // handle errors
    // error 409 -> redirect to Signin page
    .catch(error => { this.handleError(error); });
  }

  // pay with paypal

  payWithPaypal() {
    this.loading = true;
    this.disablePayment = true;
    this.paypal.pay(this.plansService.selectedPlan.id);
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

    let body = {
      AmazonBillingAgreementId: this.billingAgreementId,
      plan: this.plansService.selectedPlan.id
    };
    return this.backend.amazonUpgrade(body, {})
    // alert and redirect
    .then(() => {
      this.alertService.success('You account was upgraded!');
      this.router.navigate(['/account']);
    })
    // handle errors
    .catch(error => { this.handleError(error); });
  }

  // pay with bitpay

  payWithBitpay() {
    this.loading = true;
    this.disablePayment = true;
    this.bitpay.pay(this.plansService.selectedPlan.id);
  }

  // helper functions

  handleError(error) {
    this.zone.run(() => {
      this.loading = false;
      this.disablePayment = false;

      this.modal.header = this.errHeader;
      this.modal.body = error.message;
      this.modal.show = true;
    });
  }

  selectOption(method) {
    this.paymentMethod = method;

    // launch amazon payments
    if (this.paymentMethod === 'a') {
      this.showBTC = false;
      setTimeout(() => { this.amazon.init(); }, 100);
    }
    else if (this.paymentMethod === 'bc') { this.showBTC = true; }
    else { this.showBTC = false; }
  }

}
