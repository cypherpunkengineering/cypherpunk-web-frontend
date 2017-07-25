import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
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
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnDestroy {
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
  user;

  constructor(
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private location: Location,
    private authGuard: AuthGuard,
    private route: ActivatedRoute,
    private globals: GlobalsService,
    private backend: BackendService,
    private session: SessionService,
    private alertService: AlertService,
    private plansService: PlansService,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // handle title
    this.document.title = 'Cypherpunk Privacy & VPN Pricing and Order Form';

    // ** Hide this page from production
    if (this.globals.ENV !== 'DEV') { this.router.navigate(['/']); }

    // handle plans
    this.plansSrv = plansService;

    // Determine plans to show
    let params = this.route.snapshot.params;
    this.referralCode = params['referralCode'];
    if (this.referralCode) { this.plansService.getPlans(this.referralCode); }

    // redirect if user is already logged in
    if (isPlatformBrowser(this.platformId)) {
      this.authGuard.shouldUpgrade()
      .then(() => {
        let upgrade = false;
        let accountType = session.user.account.type;
        let subType = session.user.subscription.type;
        let renews = session.user.subscription.renews;

        if (accountType === 'free' || accountType === 'expired') { upgrade = true; }
        else if (accountType === 'premium') {
          if (renews === false) { upgrade = true; }
          if (subType !== 'annually' && subType !== 'forever') { upgrade = true; }
        }

        if (upgrade) {
          router.navigate(['/account/upgrade']);
          location.replaceState('/account/upgrade');
        }
        else {
          router.navigate(['/account']);
          location.replaceState('/account');
        }
      })
      .catch(() => { });
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
  }

  // pay with stripe

  getToken() {
    if (this.disablePayment) { return; }
    let accountForm = this.accountFormData.formInstance;
    let stripeForm = this.stripeFormData.formInstance;
    Array.prototype.map.call(document.querySelectorAll('input, select'), (input) => {
      input.focus();
    });

    // email errors
    if (!this.accountFormData.validation.email) {
      document.getElementById('emailInput').focus();
      document.getElementById('emailInput').blur();
      return;
    }
    if (accountForm['controls'].email.errors) {
      document.getElementById('emailInput').focus();
      return;
    }
    // password errors
    if (accountForm['controls'].password.errors) {
      document.getElementById('passwordInput').focus();
      return;
    }

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
    this.accountChild.disableInputs();

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
        return this.saveToServer(token);
      }
    };

    // load up stripe and create token
    // Stripe should be loaded by the stripe-form component
    let stripe = (<any>window).Stripe;
    stripe.card.createToken(stripeParams, stripeCallback);
  }

  saveToServer(token: string) {
    // call server at this point (using promises)
    let body = {
      token: token,
      plan: this.plansService.selectedPlan.id,
      email: this.accountFormData.email,
      password: this.accountFormData.password,
      referralCode: this.referralCode
    };

    // sets cookie
    return this.backend.stripeCharge(body, {})
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
      this.session.setGettingStarted(true);
      this.router.navigate(['/account']);
    })
    // handle errors
    .catch(error => { this.handleError(error); });
  }

  // pay with paypal

  payWithPaypal() {
    if (this.disablePayment) { return; }
    let accountForm = this.accountFormData.formInstance;
    Array.prototype.map.call(document.querySelectorAll('input, select'), (input) => {
      input.focus();
    });

    // email errors
    if (!this.accountFormData.validation.email) {
      document.getElementById('emailInput').focus();
      document.getElementById('emailInput').blur();
      return;
    }
    if (accountForm['controls'].email.errors) {
      document.getElementById('emailInput').focus();
      return;
    }
    // password errors
    if (accountForm['controls'].password.errors) {
      document.getElementById('passwordInput').focus();
      return;
    }

    this.loading = true;
    this.disablePayment = true;
    this.accountChild.disableInputs();

    return this.createAccount()
    .then(() => {
      this.session.setGettingStarted(true);
      this.paypal.pay(this.user.account.id, this.plansService.selectedPlan.id, this.referralCode);
    })
    .catch(error => { this.handleError(error); });
  }

  // pay with amazon

  updateBillingId(billingId) { this.billingAgreementId = billingId; }

  updateAmazonHide(amazonHide) { this.amazonHide = amazonHide; }

  updateAmazonRecurringEnabled(amazonRecurringEnabled) {
    this.amazonRecurringEnabled = amazonRecurringEnabled;
  }

  payWithAmazon() {
    if (this.disablePayment) { return; }
    let accountForm = this.accountFormData.formInstance;
    Array.prototype.map.call(document.querySelectorAll('input, select'), (input) => {
      input.focus();
    });

    // email errors
    if (!this.accountFormData.validation.email) {
      document.getElementById('emailInput').focus();
      document.getElementById('emailInput').blur();
      return;
    }
    if (accountForm['controls'].email.errors) {
      document.getElementById('emailInput').focus();
      return;
    }
    // password errors
    if (accountForm['controls'].password.errors) {
      document.getElementById('passwordInput').focus();
      return;
    }

    if (!this.amazonRecurringEnabled) {
      this.amazon.setRecurringError();
      return;
    }

    this.loading = true;
    this.disablePayment = true;
    this.accountChild.disableInputs();

    /* send billingAgreement to server */
    let body = {
      plan: this.plansService.selectedPlan.id,
      email: this.accountFormData.email,
      password: this.accountFormData.password,
      referralCode: this.referralCode,
      AmazonBillingAgreementId: this.billingAgreementId,
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
      this.session.setGettingStarted(true);
      this.router.navigate(['/account']);
    })
    // handle errors
    .catch(error => { this.handleError(error); });
  }

  // pay with bitpay

  payWithBitpay() {
    if (this.disablePayment) { return; }
    let accountForm = this.accountFormData.formInstance;
    Array.prototype.map.call(document.querySelectorAll('input, select'), (input) => {
      input.focus();
    });

    // email errors
    if (!this.accountFormData.validation.email) {
      document.getElementById('emailInput').focus();
      document.getElementById('emailInput').blur();
      return;
    }
    if (accountForm['controls'].email.errors) {
      document.getElementById('emailInput').focus();
      return;
    }
    // password errors
    if (accountForm['controls'].password.errors) {
      document.getElementById('passwordInput').focus();
      return;
    }

    this.loading = true;
    this.disablePayment = true;
    this.accountChild.disableInputs();

    return this.createAccount()
    .then(() => {
      this.session.setGettingStarted(true);
      this.bitpay.pay(this.user.account.id, this.plansService.selectedPlan.id, this.referralCode);
    })
    .catch(error => { this.handleError(error); });
  }

  // helper functions

  createAccount(): Promise<void> {
    // sets cookie
    let body = { email: this.accountFormData.email, password: this.accountFormData.password };
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
