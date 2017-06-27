import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { isPlatformBrowser, Location } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import { PlansService, Plan } from '../../../services/plans.service';
import { Component, PLATFORM_ID, Inject, NgZone, ViewChild, OnDestroy } from '@angular/core';
import country_list from '../../public/pricing/countries';

@Component({
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent implements OnDestroy {
  @ViewChild('amazon') amazon;
  @ViewChild('paypal') paypal;
  @ViewChild('bitpay') bitpay;
  @ViewChild('priceBoxes') priceBoxes;

  // payment options (cc, a, pp, bc)
  loading = true;
  paymentMethod = '';
  countries = country_list;
  disablePayment = false;
  modal = { show: false, header: '', body: '' };
  errHeader = 'Error processing your payment';
  referralCode: string;
  plansSrv;

  // user variables
  user;

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

    // handle plans
    this.plansSrv = plansService;

    // Determine plans to show
    let params = this.activatedRoute.snapshot.params;
    this.referralCode = params['referralCode'];
    if (this.referralCode) { this.plansService.getPlans(this.referralCode); }

    // check if valid user account
    if (isPlatformBrowser(this.platformId)) {
      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.authGuard.canActivate(route, state)
      .then((data) => { this.loading = data.loading || false; })
      .then(() => {
        this.user = session.user;
        let redirect = true;
        let accountType = session.user.account.type;
        let subType = session.user.subscription.type;
        let renews = session.user.subscription.renews;

        if (accountType === 'free' || accountType === 'expired') { redirect = false; }
        else if (accountType === 'premium') {
          if (renews === false) { redirect = false; }
          if (subType !== 'annually' && subType !== 'forever') { redirect = false; }
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
      });
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
    if (this.disablePayment) { return; }
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
      let el = document.getElementById('zipCodeSelect');
      if (el) { el.focus(); }
      return;
    }


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
    // set cookie
    return this.backend.createCard(body, {})
    .then((data) => { this.auth.authed = true; return data; })
    // alert and redirect
    .then((data) => {
      this.zone.run(() => {
        this.defaultCardId = data.default_source;
        this.cards = data.sources;
      });
      // return this.saveToServer();
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
    return this.backend.defaultCard(body, {})
    .then((data) => {
      this.defaultCardId = data.default_source;
      this.cards = data.sources;
    })
    .then(() => { return this.saveToServer(); });
  }

  saveToServer() {
    let body = {
      plan: this.plansService.selectedPlan.id,
      referralCode: this.referralCode
    };

    // set cookie
    return this.backend.stripeUpgrade(body, {})
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
    this.paypal.pay(this.user.account.id, this.plansService.selectedPlan.id, this.referralCode);
  }

  // pay with amazon

  updateBillingId(billingId) { this.billingAgreementId = billingId; }

  updateAmazonHide(amazonHide) { this.amazonHide = amazonHide; }

  updateAmazonRecurringEnabled(amazonRecurringEnabled) {
    this.amazonRecurringEnabled = amazonRecurringEnabled;
  }

  payWithAmazon() {
    if (!this.amazonRecurringEnabled) {
      this.amazon.setRecurringError();
      return;
    }

    if (this.disablePayment) { return; }
    this.loading = true;
    this.disablePayment = true;

    let body = {
      plan: this.plansService.selectedPlan.id,
      referralCode: this.referralCode,
      AmazonBillingAgreementId: this.billingAgreementId
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
    this.bitpay.pay(this.user.account.id, this.plansService.selectedPlan.id, this.referralCode);
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
    if (method === 'a') {
      this.showBTC = false;
      setTimeout(() => { this.amazon.init(); }, 100);
    }
    else if (method === 'bc') { this.showBTC = true; }
    else { this.showBTC = false; }
  }

  ngOnDestroy() {
    if (this.referralCode) { this.plansService.useDefaultPlans(true); }
  }

}
