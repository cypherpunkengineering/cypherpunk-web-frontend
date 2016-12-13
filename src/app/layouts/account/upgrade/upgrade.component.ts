import { Component, NgZone } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import { PlansService } from '../../../services/plans.service';
import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent {
  loading: boolean = true;
  posData: string = '';
  ccButtonDisabled: boolean = false;
  ppButtonDisabled: boolean = false;
  amButtonDisabled: boolean = false;
  bpButtonDisabled: boolean = false;

  // Stripe variables
  cardNumber: string;
  expiryDate: string;
  cvc: string;

  // user variables
  email: string;
  name: string;

  // validation variables
  validCCName: boolean = false;
  validCCNumber: boolean = false;
  validCCExpiry: boolean = false;
  validCCcvc: boolean = false;
  ccNameTouched: boolean = false;
  ccNumberTouched: boolean = false;
  ccExpiryTouched: boolean = false;
  ccCVCTouched: boolean = false;

  // pricing model
  plans = this.plansService.plans;
  selectPlan = this.plansService.selectPlan;
  selectedPlan = this.plansService.selectedPlan;

  // payment options

  paymentOptions = [
    {
      type: 'cc',
      selected: true
    },
    {
      type: 'a',
      selected: false
    },
    {
      type: 'pp',
      selected: false
    },
    {
      type: 'bc',
      selected: false
    }
  ];

  selectedOption = this.paymentOptions[0];

  constructor(
    private http: Http,
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private authGuard: AuthGuard,
    private session: SessionService,
    private alertService: AlertService,
    private plansService: PlansService,
    private activatedRoute: ActivatedRoute
  ) {
    this.email = session.user.account.email;

    let route = activatedRoute.snapshot;
    let state = router.routerState.snapshot;
    this.authGuard.canActivate(route, state)
    .then(() => {
      let redirect = true;
      let type = session.user.account.type;
      let renewal = session.user.subscription.renewal;
      if (type === 'free') { redirect = false; }
      else if (type === 'premium' && renewal !== 'annually') { redirect = false; }
      if (redirect) { router.navigate(['/account']); }
    })
    .then(() => { this.loading = false; });
  }

  // pay with credit card

  getToken() {
    this.ccButtonDisabled = true;

    let month: number;
    let year: number;

    month = Number(this.expiryDate.split('/')[0]);
    year = Number(this.expiryDate.split('/')[1]);

    // stripe params
    let stripeParams = {
      number: this.cardNumber,
      exp_month: month,
      exp_year: year,
      cvc: this.cvc
    };

    // stripe callback
    let stripeCallback = (status: number, response: any) => {
      let token = response.id;
      return this.saveToServer(token);
    };

    // load up stripe and create token
    let stripe = (<any>window).Stripe;
    stripe.card.createToken(stripeParams, stripeCallback);
  }

  saveToServer(token: string) {
    let serverParams = {
      token: token,
      plan: this.selectedPlan.id,
      email: this.email
    };

    // call server at this point (using promises)
    let url = '/api/v0/subscription/upgrade';
    let body = serverParams;
    let options = new RequestOptions({});
    // set cookie?
    return this.http.post(url, body, options).toPromise()
    .then(() => { this.auth.authed = true; })
    // alert and redirect
    .then(() => {
      this.alertService.success('You have upgraded your account');
      this.router.navigate(['/account']);
    })
    // handle errors
    .catch((error) => {
      console.log(error);
      this.zone.run(() => {
        this.ccButtonDisabled = false;
        this.alertService.error('Could not upgrade your account');
      });
      // error 409 -> redirect to login page
    });
  }

  // pay with paypal

  payWithPaypal() {
    this.ppButtonDisabled = true;

    if (this.selectedPlan.id === 'monthly899') {
      document.getElementById('paypalMonthly').click();
    }
    else if (this.selectedPlan.id === 'annually5999') {
      document.getElementById('paypalAnnual').click();
    }
    else if (this.selectedPlan.id === 'semiannually4499') {
      document.getElementById('paypalSemiannual').click();
    }
  }

  // pay with amazon

  amazonInit(callback) {
    let amazonPayments = (<any>window).amazonPayments;
    amazonPayments.init(callback);
  }

  amazonCallback(billingAgreement) {
    console.log('back in angular');
    console.log(billingAgreement);
    /* send billingAgreement to server */
    /* on return show amazonButton */
  }

  amazonButton() {
    this.amButtonDisabled = true;
    console.log('paid with amazon');
    this.amButtonDisabled = false;
  }

  // pay with bitpay

  payWithBitpay() {
    this.bpButtonDisabled = true;

    let posId = {
      email: this.email,
      planId: this.selectedPlan.id
    };
    this.posData = JSON.stringify(posId);

    if (this.selectedPlan.id === 'monthly899') {
      document.getElementById('bitpayMonthly').click();
    }
    else if (this.selectedPlan.id === 'annually5999') {
      document.getElementById('bitpayAnnual').click();
    }
    else if (this.selectedPlan.id === 'semiannually4499') {
      document.getElementById('bitpaySemiannual').click();
    }
  }

  // validation functions

  validateCCName() {
    this.ccNameTouched = true;

    if (!this.name) { this.validCCName = false; }
    else { this.validCCName = true; }
    return this.validCCName;
  }

  validateCCNumber() {
    this.ccNumberTouched = true;

    let stripe = (<any>window).Stripe;
    this.validCCNumber = stripe.card.validateCardNumber(this.cardNumber);
    return this.validCCNumber;
  }

  validateCCExpiry() {
    this.ccExpiryTouched = true;

    if (this.expiryDate && this.expiryDate.length === 2) { this.expiryDate += '/'; }

    let stripe = (<any>window).Stripe;
    this.validCCExpiry = stripe.card.validateExpiry(this.expiryDate);
    if (this.validCCExpiry) { document.getElementById('cccvc').focus(); }
    return this.validCCExpiry;
  }

  validateCCcvc() {
    this.ccCVCTouched = true;

    let stripe = (<any>window).Stripe;
    this.validCCcvc = stripe.card.validateCVC(this.cvc);
    return this.validCCcvc;
  }

  validateCC() {
    return this.validCCName && this.ccNameTouched &&
    this.validCCNumber && this.ccNumberTouched &&
    this.validCCExpiry && this.ccExpiryTouched &&
    this.validCCcvc && this.ccCVCTouched;
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // option functions

  selectOption(option) {
    this.selectedOption = option;
    this.paymentOptions.map((item) => { item.selected = false; });
    option.selected = true;

    // launch amazon payments
    if (option.type === 'a') {
      setTimeout(() => { this.amazonInit(this.amazonCallback); }, 100);
    }
  }

}
