import { RequestOptions} from '@angular/http';
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
  @ViewChild('priceBoxes') priceBoxes;

  paymentMethod = ''; // payment options (cc, a, pp, bc)
  countries = country_list;
  loading = false;
  disablePayment = false;
  modal = { show: false, header: '', body: '', link: false };
  errHeader = 'Error processing your payment';

  // plan details
  planData = {
    plans: [],
    selected: { id: '' },
    referralCode: ''
  };

  // user variables
  accountFormData = {
    email: '',
    password: '',
    validation: {
      email: false,
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
  billingAgreementId: string;
  amazonHide = false;
  amazonRecurringEnabled = false;

  // bitpay variables
  showBTC = false;

  // Paypal variables
  userId: string;

  constructor(
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private location: Location,
    private authGuard: AuthGuard,
    private route: ActivatedRoute,
    private backend: BackendService,
    private session: SessionService,
    private alertService: AlertService,
    private plansService: PlansService,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // handle title
    this.document.title = 'Cypherpunk Privacy & VPN Pricing and Order Form';

    // Determine plans to show
    let params = this.route.snapshot.params;
    this.planData.referralCode = params['referralCode'];
    if (this.planData.referralCode) {
      let body = { referralCode: this.planData.referralCode };
      let options = new RequestOptions({});
      this.backend.pricingPlans(body, options)
      // build plans as needed
      .then((plans) => {
        this.planData.plans = [];
        // monthly plan
        this.planData.plans.push({
          id: 'monthly',
          price: Number(plans.monthly.price),
          bcPrice: undefined,
          rate: 'monthly plan',
          months: 1,
          viewable: true,
          bitpayData: plans.monthly.bitpayPlanId,
          paypalButtonId: plans.monthly.paypalPlanId
        });
        // annual plan
        this.planData.plans.push({
          id: 'annually',
          price: Number(plans.annually.price),
          bcPrice: undefined,
          rate: '12 month plan',
          months: 12,
          viewable: true,
          bitpayData: plans.monthly.bitpayPlanId,
          paypalButtonId: plans.monthly.paypalPlanId
        });
        // semiannual plan
        this.planData.plans.push({
          id: 'semiannually',
          price: Number(plans.semiannually.price),
          bcPrice: undefined,
          rate: '6 month plan',
          months: 6,
          viewable: true,
          bitpayData: plans.semiannually.bitpayPlanId,
          paypalButtonId: plans.semiannually.paypalPlanId
        });
        this.planData.selected = this.planData.plans[1];
        this.priceBoxes.updatePlans();
      })
      .catch((err) => {
        console.log('Could not pull pricing plans, defaulting');
        this.planData.plans = plansService.plans;
        this.planData.selected = plansService.selectedPlan;
      });
    }
    else {
      this.planData.plans = plansService.plans;
      this.planData.selected = plansService.selectedPlan;
    }

    // redirect if user is already logged in
    if (isPlatformBrowser(this.platformId)) {
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

        if (redirect) {
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
      plan: this.planData.selected.id,
      email: this.accountFormData.email,
      password: this.accountFormData.password,
      referralCode: this.planData.referralCode
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
      this.alertService.success('Your account was created!');
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
    .then(() => { this.paypal.pay(this.planData.selected.id, this.planData.referralCode); })
    .catch(error => { this.handleError(error); });
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

    /* send billingAgreement to server */
    let body = {
      plan: this.planData.selected.id,
      email: this.accountFormData.email,
      password: this.accountFormData.password,
      referralCode: this.planData.referralCode,
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
      this.alertService.success('Your account was created!');
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
    .then(() => { this.bitpay.pay(this.planData.selected.id, this.planData.referralCode); })
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
    .then(() => { this.alertService.success('Your account was created!'); });
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
