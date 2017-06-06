import { RequestOptions } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { isPlatformBrowser, Location } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { PlansService } from '../../../services/plans.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import { Component, PLATFORM_ID, Inject, NgZone, ViewChild } from '@angular/core';
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
  plans;
  paymentMethod = '';
  countries = country_list;
  loading = true;
  disablePayment = false;
  modal = { show: false, header: '', body: '' };
  errHeader = 'Error processing your payment';

  // user variables
  email: string;
  userId: string;
  sessionUser;

  // Stripe variables
  cards = [];
  defaultCardId = '';
  showCreateCard = false;
  stripeFormData = {
    name: '',
    cardNumber: '',
    month: '',
    year: '',
    cvc: '',
    country: '',
    zipCode: '',
    form: { valid: false },
    formInstance: {}
  };

  // Amazon variables
  billingAgreementId: string;
  amazonHide = false;
  amazonRecurringEnabled = false;

  // bitpay variables
  showBTC = false;

  constructor(
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private location: Location,
    private authGuard: AuthGuard,
    private session: SessionService,
    private backend: BackendService,
    private alertService: AlertService,
    private plansService: PlansService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // handle title
    this.document.title = 'Upgrade Cypherpunk Account';

    this.plans = plansService;

    // check if valid user account
    if (isPlatformBrowser(this.platformId)) {
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
          router.navigate(['/account']);
          location.replaceState('/account');
        }
      })
      .catch(() => { /* keep error from showing on console */ });
    }

    // use Geo-IP to preload CC country
    if (isPlatformBrowser(this.platformId)) {
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
    if (isPlatformBrowser(this.platformId)) {
      backend.cards()
      .subscribe((data: any) => {
        this.defaultCardId = data.default_source;
        this.cards = data.sources;
        if (!this.cards.length) { this.showCreateCard = true; }
      }, () => {});
    }
  }

  // pay with credit card

  stripeUpgrade() {
    if (this.disablePayment) { return; }
    if (this.showCreateCard) {
      let stripeForm = this.stripeFormData.formInstance;
      Array.prototype.map.call(document.querySelectorAll('input, select'), (input) => {
        input.focus();
      });

      // name, nameInput
      if (stripeForm['controls'].name.errors) {
        document.getElementById('nameInput').focus();
        return;
      }

      // Credit Card Number errors
      if (stripeForm['controls'].cardNumber.errors) {
        document.getElementById('cardNumberInput').focus();
        return;
      }

      // expiryMonth, ccexpirymonth
      if (stripeForm['controls'].expiryMonth.errors) {
        document.getElementById('ccexpirymonth').focus();
        return;
      }

      // expiryYear, ccexpiryyear
      if (stripeForm['controls'].expiryYear.errors) {
        document.getElementById('ccexpiryyear').focus();
        return;
      }

      // cvc, cccvc
      if (stripeForm['controls'].cvc.errors) {
        document.getElementById('cccvc').focus();
        return;
      }

      // country, country
      if (stripeForm['controls'].country.errors) {
        document.getElementById('country').focus();
        return;
      }

      // zipCode, zipCodeSelect
      if (stripeForm['controls'].zipCode.errors) {
        document.getElementById('zipCodeSelect').focus();
        return;
      }

      this.getToken();
    }
    else { this.finalizeDefaultCard(); }
  }

  // stripe upgrade with new card

  getToken() {
    // show loading overlay
    this.loading = true;
    this.disablePayment = true;

    // stripe params
    let stripeParams = {
      name: this.stripeFormData.name,
      number: this.stripeFormData.cardNumber,
      exp_month: this.stripeFormData.month,
      exp_year: this.stripeFormData.year,
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
    // stripe should be loaded by the stripe-form component
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
    if (this.disablePayment) { return; }
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

  updateAmazonRecurringEnabled(amazonRecurringEnabled) {
    this.amazonRecurringEnabled = amazonRecurringEnabled;
  }

  payWithAmazon() {
    if (this.disablePayment) { return; }
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
    if (this.disablePayment) { return; }
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
