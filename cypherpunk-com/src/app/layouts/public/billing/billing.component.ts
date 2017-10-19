import { Router, ActivatedRoute } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { AuthService } from '../../../services/auth.service';
import { isPlatformBrowser, Location } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { GlobalsService } from '../../../services/globals.service';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import { PlansService, Plan } from '../../../services/plans.service';
import { Component, PLATFORM_ID, Inject, NgZone, ViewChild, OnDestroy } from '@angular/core';
import country_list from './countries';

@Component({
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnDestroy {
  @ViewChild('accounts') accountChild;
  @ViewChild('amazon') amazon;
  @ViewChild('paypal') paypal;
  @ViewChild('bitpay') bitpay;
  @ViewChild('priceBoxes') priceBoxes;

  loading = false;
  paymentMethod = ''; // payment options (cc, a, pp, bc)
  disablePayment = false;
  countries = country_list;
  modal = { show: false, header: '', body: '', link: false };
  errHeader = 'Error processing your payment';
  referralCode: string;
  plansSrv;

  // user variables
  accountFormData = {
    email: '',
    password: '',
    validation: {
      email: true,
      warning: false,
      disabled: false
    },
    form: { valid: false },
    formInstance: {}
  };

  // Stripe variables
  cards: any[];
  selectedCard?: string;
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
  amazonHide = false;
  billingAgreementId: string;
  amazonRecurringEnabled = false;

  // bitpay variables
  showBTC = false;

  // Paypal variables
  user: any;

  constructor(
    private zone: NgZone,
    private router: Router,
    private seo: SeoService,
    private auth: AuthService,
    private location: Location,
    private authGuard: AuthGuard,
    private route: ActivatedRoute,
    private globals: GlobalsService,
    private backend: BackendService,
    private session: SessionService,
    private alertService: AlertService,
    private plansService: PlansService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy & VPN Pricing and Order Form',
      description: 'Pricing and order form for Cypherpunk Online Privacy service.',
      url: '/billing'
    });

    // ** Hide this page from production
    if (this.globals.ENV !== 'DEV') {
      this.router.navigate(['/pricing/preview']);
      return;
    }

    // handle plans
    this.plansSrv = plansService;
    // handle user
    this.user = session.user;

    // Determine plans to show
    let params = this.route.snapshot.params;
    this.referralCode = params['referralCode'];
    if (this.referralCode) { this.plansService.getPlans(this.referralCode); }

    // redirect if user is already logged in
    if (isPlatformBrowser(this.platformId)) {
      this.authGuard.shouldUpgrade().catch(() => { });
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
      });
    }

    // get all stripe cards for this user
    if (isPlatformBrowser(this.platformId) && this.user.account.id) {
      backend.cards()
      .subscribe((data: any) => this.zone.run(() => {
        this.cards = data;
        this.selectedCard = this.cards.length && this.cards[0].token || null;
      }),
      (err) => this.zone.run(() => {
        console.log(err);
        this.selectedCard = null;
      }));
    }
  }

  // If the user is logged in, instantly resolves to their id, otherwise checks
  // the account info fields and tries to either register an account or log in,
  // again resolving to the account id if successful.
  ensureAccountExists() : Promise<string> {
    // already logged in?
    if (this.user.account.id) { return Promise.resolve(this.user.account.id); }

    // check if we have valid login/register fields
    if (!this.validateAccount()) { return Promise.reject(new Error("Invalid account details")); }

    // TODO: try to login to an existing account if signup fails?
    return this.auth.signup({ email: this.accountFormData.email, password: this.accountFormData.password, billing: true })
    .then(() => this.zone.run(() => {
      if (!this.user.account.id) throw new Error("Failed to create account");
      this.session.setGettingStarted(true);
      return this.user.account.id;
    }));
  }


  // pay with stripe

  payWithStripe() {
    let stripe = (<any>window).Stripe;
    if (!stripe) { console.error("Stripe not loaded"); return; }

    let accountId = this.user.account.id;
    let planId = this.plansService.selectedPlan.id;

    if (!this.selectedCard && !this.validateStripe()) { return; }

    // block double payment
    if (this.disablePayment) { return false; }
    else { this.disablePayment = true; }

    // TODO: should have a global flag to disable all fields
    this.accountChild.disableInputs();
    // enable loading screen
    this.loading = true;

    // track payment
    let ga = (<any>window).ga;
    ga('send', {
      hitType: 'event',
      eventCategory: 'Subscription',
      eventAction: 'buy',
      eventLabel: 'payment',
      eventValue: Math.floor(this.plansService.selectedPlan.price)
    });

    // check or register account
    this.ensureAccountExists()
    .then(id => { accountId = id; })
    // create a card token if needed
    .then(() => {
      if (this.selectedCard) { return this.selectedCard; } // existing token selected
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
      return new Promise((resolve, reject) => stripe.card.createToken(stripeParams, (status, response) => {
        if (response.error) { reject(response.error); }
        else { resolve(response.id); }
      }));
    })
    // register token with the account
    .then((token: string) => this.backend.payWithStripe({ planId, referralCode: this.referralCode, token }))
    //
    .then(() => {
      this.router.navigate(['/billing/complete/stripe']);
    }, err => {
      console.error(err);
      // FIXME: Show an error dialog?
      this.accountChild.enableInputs();
      this.loading = false;
      this.disablePayment = false;
    });

  }

  /*
  stripeBegin() {
    // block double payment
    if (this.disablePayment) { return false; }
    else { this.disablePayment = true; }

    // handle account form validation
    let accountId = this.user.account.id;
    if (!accountId && !this.validateAccount()) { return; }
    else { this.accountChild.disableInputs(); }

    // three way split on using stripe
    if (!accountId) { // signup path, no account
      if (!this.validateStripe()) { return; }
      else { this.loading = true; }
      return this.getToken(false); // getToken -> saveToServer
    }
    else if (accountId && this.showCreateCard) { // upgrade path with new card
      if (!this.validateStripe()) { return; }
      else { this.loading = true; }
      return this.getToken(true); // getToken -> createCard -> saveToServer
    }
    else { // upgrade path, existing card
      this.loading = true;
      return this.stripeUpgrade(); // saveToServer
    }
  }

  getToken(upgrade: boolean) {
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
        if (upgrade) { return this.createCard(token); }
        else { return this.stripeSignup(token); }
      }
    };

    // load up stripe and create token
    // Stripe should be loaded by the stripe-form component
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
      this.zone.run(() => { this.cards = data.sources; });
      return this.stripeUpgrade();
    })
    // handle errors
    // error 409 -> redirect to Signin page
    .catch(error => { this.handleError(error); });
  }

  // stripe upgrade with existing card

  stripeSignup(token: string) {
    // track payment
    let ga = (<any>window).ga;
    ga('send', {
      hitType: 'event',
      eventCategory: 'Subscription',
      eventAction: 'buy',
      eventLabel: 'payment',
      eventValue: Math.floor(this.plansService.selectedPlan.price)
    });

    let body = {
      token: token,
      plan: this.plansService.selectedPlan.id,
      email: this.accountFormData.email,
      password: this.accountFormData.password,
      referralCode: this.referralCode
    };

    return this.backend.stripeCharge(body, {})
    .then((data) => { this.session.setUserData(data); })
    .then(() => { this.auth.authed = true; })
    .then(() => { this.session.setGettingStarted(true); })
    .then(() => { this.router.navigate(['/account']); })
    .catch(error => { this.handleError(error); });
  }

  stripeUpgrade() {
    // track payment
    let ga = (<any>window).ga;
    ga('send', {
      hitType: 'event',
      eventCategory: 'Subscription',
      eventAction: 'buy',
      eventLabel: 'payment',
      eventValue: Math.floor(this.plansService.selectedPlan.price)
    });

    let body = {
      plan: this.plansService.selectedPlan.id,
      referralCode: this.referralCode
    };

    // set cookie
    return this.backend.stripeUpgrade(body, {})
    .then(() => { this.auth.authed = true; })
    .then(() => {
      this.zone.run(() => {
        this.alertService.success('You have upgraded your account');
        this.router.navigate(['/account']);
      });
    })
    // error 409 -> redirect to Signin page
    .catch(error => { this.handleError(error); });
  }
  */

  // pay with paypal

  payWithPaypal() {
    // block double payment
    if (this.disablePayment) { return false; }
    else { this.disablePayment = true; }

    let accountId = this.user.account.id;
    let planId = this.plansService.selectedPlan.id;

    // TODO: should have a global flag to disable all fields
    this.accountChild.disableInputs();
    // enable loading screen
    this.loading = true;

    // track payment
    let ga = (<any>window).ga;
    ga('send', {
      hitType: 'event',
      eventCategory: 'Subscription',
      eventAction: 'buy',
      eventLabel: 'payment',
      eventValue: Math.floor(this.plansService.selectedPlan.price)
    });

    // check or register account
    this.ensureAccountExists()
    .then(id => { accountId = id; })
    //.then(() => new Promise(resolve => setTimeout(resolve, 10000)))
    .then(() => this.backend.payWithPaypal({ planId, referralCode: this.referralCode, site: window.location.protocol + '//' + window.location.host }))
    .then(data => this.paypal.checkout(data))
    .catch(err => {
      console.error(err);
      // FIXME: Show an error dialog?
      this.accountChild.enableInputs();
      this.loading = false;
      this.disablePayment = false;
    });

    // handle account form validation
    //let accountId = this.user.account.id;
    //if (!accountId && !this.validateAccount()) { return; }
    //else { this.accountChild.disableInputs(); }

    // enable loading screen
    //this.loading = true;

    // signup or upgrade using bitpay
    //if (accountId) { return this.paypalUpgrade(accountId); }
    //else { return this.paypalSignup(accountId); }
  }

  paypalSignup(accountId) {
    let planId = this.plansService.selectedPlan.id;
    return this.createAccount()
    .then(() => { this.session.setGettingStarted(true); })
    .then(() => { this.paypal.pay(accountId, planId, this.referralCode); })
    .catch(error => { this.handleError(error); });
  }

  paypalUpgrade(accountId) {
    this.paypal.pay(accountId, this.plansService.selectedPlan.id, this.referralCode);
  }


  // pay with amazon

  updateBillingId(billingId) { this.billingAgreementId = billingId; }

  updateAmazonHide(amazonHide) { this.amazonHide = amazonHide; }

  updateAmazonRecurringEnabled(amazonRecurringEnabled) {
    this.amazonRecurringEnabled = amazonRecurringEnabled;
  }

  payWithAmazon() {
    // block double payment
    if (this.disablePayment) { return false; }
    else { this.disablePayment = true; }

    // handle account form validation
    let accountId = this.user.account.id;
    if (!accountId && !this.validateAccount()) { return; }
    else { this.accountChild.disableInputs(); }

    // handle noncompliance with amazon recurring
    if (!this.amazonRecurringEnabled) { return this.amazon.setRecurringError(); }

    // track payment
    let ga = (<any>window).ga;
    ga('send', {
      hitType: 'event',
      eventCategory: 'Subscription',
      eventAction: 'buy',
      eventLabel: 'payment',
      eventValue: Math.floor(this.plansService.selectedPlan.price)
    });

    // enable loading screen
    this.loading = true;

    // signup or upgrade with amazon
    if (accountId) {
      return this.amazonUpgrade({
        plan: this.plansService.selectedPlan.id,
        referralCode: this.referralCode,
        AmazonBillingAgreementId: this.billingAgreementId
      });
    }
    else {
      return this.amazonSignup({
        plan: this.plansService.selectedPlan.id,
        email: this.accountFormData.email,
        password: this.accountFormData.password,
        referralCode: this.referralCode,
        AmazonBillingAgreementId: this.billingAgreementId,
      });
    }
  }

  amazonSignup(body) {
    return this.backend.amazonCharge(body, {})
    .then((data) => { this.session.setUserData(data); }) // set user session
    .then(() => { this.auth.authed = true; }) // turn on authed
    .then(() => { this.session.setGettingStarted(true); }) // show getting started
    .then(() => { this.router.navigate(['/account']); }) // redirect to account page
    .catch(error => { this.handleError(error); });
  }

  amazonUpgrade(body) {
    return this.backend.amazonUpgrade(body, {})
    .then(() => { this.alertService.success('You account was upgraded!'); })
    .then(() => { this.router.navigate(['/account']); }) // redirect to account page
    .catch(error => { this.handleError(error); });
  }


  // pay with bitpay

  payWithBitpay() {
    // block double payment
    if (this.disablePayment) { return; }
    else { this.disablePayment = true; }

    // handle account form validation
    let accountId = this.user.account.id;
    if (!accountId && !this.validateAccount()) { return; }
    else { this.accountChild.disableInputs(); }

    // track payment
    let ga = (<any>window).ga;
    ga('send', {
      hitType: 'event',
      eventCategory: 'Subscription',
      eventAction: 'buy',
      eventLabel: 'payment',
      eventValue: Math.floor(this.plansService.selectedPlan.price)
    });

    // enable loading screen
    this.loading = true;

    // signup or upgrade using bitpay
    if (accountId) { return this.bitpayUpgrade(accountId); }
    else { return this.bitpaySignup(accountId); }
  }

  bitpaySignup(accountId) {
    let planId = this.plansService.selectedPlan.id;
    return this.createAccount()
    .then(() => { this.session.setGettingStarted(true); })
    .then(() => { this.bitpay.pay(accountId, planId, this.referralCode); })
    .catch(error => { this.handleError(error); });
  }

  bitpayUpgrade(accountId) {
    this.bitpay.pay(accountId, this.plansService.selectedPlan.id, this.referralCode);
  }


  // helper functions

  validateAccount() {
    let accountForm = this.accountFormData.formInstance;
    let inputs = document.querySelectorAll('input, select');
    Array.prototype.map.call(inputs, (input) => { input.focus(); });

    // email errors
    if (!this.accountFormData.validation.email) {
      document.getElementById('emailInput').focus();
      document.getElementById('emailInput').blur();
      return false;
    }
    if (accountForm['controls'].email.errors) {
      document.getElementById('emailInput').focus();
      return false;
    }
    // password errors
    if (accountForm['controls'].password.errors) {
      document.getElementById('passwordInput').focus();
      return false;
    }

    return true;
  }

  validateStripe() {
    let stripeForm = this.stripeFormData.formInstance;
    let inputs = document.querySelectorAll('input, select');
    Array.prototype.map.call(inputs, (input) => { input.focus(); });

    // name, nameInput
    if (stripeForm['controls'].name.errors) {
      document.getElementById('nameInput').focus();
      return false;
    }

    // Credit Card Number errors
    if (stripeForm['controls'].cardNumber.errors) {
      document.getElementById('cardNumberInput').focus();
      return false;
    }

    // expiryMonth, ccexpirymonth
    if (stripeForm['controls'].expiryMonth.errors) {
      document.getElementById('ccexpirymonth').focus();
      return false;
    }

    // expiryYear, ccexpiryyear
    if (stripeForm['controls'].expiryYear.errors) {
      document.getElementById('ccexpiryyear').focus();
      return false;
    }

    // cvc, cccvc
    if (stripeForm['controls'].cvc.errors) {
      document.getElementById('cccvc').focus();
      return false;
    }

    // country, country
    if (stripeForm['controls'].country.errors) {
      document.getElementById('country').focus();
      return false;
    }

    // zipCode, zipCodeSelect
    if (stripeForm['controls'].zipCode.errors) {
      let el = document.getElementById('zipCodeSelect');
      if (el) { el.focus(); }
      return false;
    }

    return true;
  }

  createAccount(): Promise<void> {
    // sets cookie
    let body = { email: this.accountFormData.email, password: this.accountFormData.password, billing: true };
    return this.backend.createAccount(body, {})
    // set user session
    .then((data) => {
      this.user = data;
      this.session.setUserData({
        account: { email: data.account.email },
        secret: data.secret
      });
    })
    // turn on authed
    .then(() => { this.auth.authed = true; });
  }

  handleError(error) {
    this.zone.run(() => {
      this.loading = false;
      this.disablePayment = false;

      console.log(error);
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

  ngOnDestroy() {
    if (this.referralCode) { this.plansService.useDefaultPlans(true); }
  }
}
