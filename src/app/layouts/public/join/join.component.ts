import { Component, NgZone } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { SessionService } from '../../../services/session.service';
import { PlansService } from '../../../services/plans.service';
import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent {
  message: string;
  messageClass: string = '';
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
  password: string;
  name: string;

  // payment plans

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
    private session: SessionService,
    private alertService: AlertService,
    private plansService: PlansService
  ) { }

  // pay with credit card

  getToken() {
    this.ccButtonDisabled = true;

    // show user we're charging the card
    this.message = 'Loading...';

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
      email: this.email,
      password: this.password
    };

    // call server at this point (using promises)
    let url = '/api/v0/subscription/purchase';
    let body = serverParams;
    let options = new RequestOptions({});
    // sets cookie
    return this.http.post(url, body, options).toPromise()
    // set user session
    .then((res: Response) => {
      let resData = res.json() || {};
      this.session.setUserData({
        account: { email: resData.account.email },
        secret: resData.secret
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
      console.log(error);
      this.zone.run(() => {
        this.ccButtonDisabled = false;
        this.alertService.error('Could not create an account');
      });
    });
  }

  // pay with paypal

  payWithPaypal() {
    this.ppButtonDisabled = true;

    let serverParams = {
      email: this.email,
      password: this.password
    };

    // call server at this point (using promises)
    let url = '/api/v0/account/register/signup';
    let body = serverParams;
    let options = new RequestOptions({});
    // sets cookie
    return this.http.post(url, body, options).toPromise()
    // set user session
    .then((res: Response) => {
      let resData = res.json() || {};
      this.session.setUserData({
        account: { email: resData.account.email },
        secret: resData.secret
      });
    })
    // turn on authed
    .then(() => { this.auth.authed = true; })
    // alert and redirect to paypal
    .then(() => {
      this.alertService.success('You account was created!');
    })
    .then(() => {
      if (this.selectedPlan.id === 'monthly899') {
        document.getElementById('paypalMonthly').click();
      }
      else if (this.selectedPlan.id === 'annually5999') {
        document.getElementById('paypalAnnual').click();
      }
      else if (this.selectedPlan.id === 'semiannually4499') {
        document.getElementById('paypalSemiannual').click();
      }
    })
    // handle errors
    .catch((error) => {
      console.log(error);
      this.zone.run(() => {
        this.ppButtonDisabled = false;
        this.alertService.error('Could not create an account');
      });
    });
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

    let serverParams = {
      email: this.email,
      password: this.password
    };

    // call server at this point (using promises)
    let url = '/api/v0/account/register/signup';
    let body = serverParams;
    let options = new RequestOptions({});
    // sets cookie
    return this.http.post(url, body, options).toPromise()
    // set user session
    .then((res: Response) => {
      let resData = res.json() || {};
      this.session.setUserData({
        account: { email: resData.account.email },
        secret: resData.secret
      });
    })
    // turn on authed
    .then(() => { this.auth.authed = true; })
    // alert and redirect to paypal
    .then(() => {
      this.alertService.success('You account was created!');
    })
    .then(() => {
      let posId = {
        email: this.email,
        planId: this.selectedPlan.id
      };
      this.posData = JSON.stringify(posId);
    })
    .then(() => {
      if (this.selectedPlan.id === 'monthly899') {
        document.getElementById('bitpayMonthly').click();
      }
      else if (this.selectedPlan.id === 'annually5999') {
        document.getElementById('bitpayAnnual').click();
      }
      else if (this.selectedPlan.id === 'semiannually4499') {
        document.getElementById('bitpaySemiannual').click();
      }
    })
    // handle errors
    .catch((error) => {
      console.log(error);
      this.zone.run(() => {
        this.bpButtonDisabled = false;
        this.alertService.error('Could not create an account');
      });
    });
  }

  validateCC() {
    if (!this.email) {
      this.message = 'Email is required';
      this.messageClass = 'error';
      return false;
    }

    if (!this.password) {
      this.message = 'Password is required';
      this.messageClass = 'error';
      return false;
    }

    if (!this.name) {
      this.message = 'Name is required';
      this.messageClass = 'error';
      return false;
    }

    if (!this.cardNumber) {
      this.message = 'Credit Card is required';
      this.messageClass = 'error';
      return false;
    }

    if (!this.expiryDate) {
      this.message = 'Expiration is required';
      this.messageClass = 'error';
      return false;
    }
    else if (this.expiryDate) {
      let month = this.expiryDate.split('/')[0];
      let year = this.expiryDate.split('/')[1];

      if (!this.isNumber(month)) {
        this.message = 'Month is not a number';
        this.messageClass = 'error';
        return false;
      }
      if (!this.isNumber(year)) {
        this.message = 'Year is not a number';
        this.messageClass = 'error';
        return false;
      }
    }

    if (!this.cvc) {
      this.message = 'CVC/CVV number is required';
      this.messageClass = 'error';
      return false;
    }

    this.message = '';
    this.messageClass = '';
    return true;
  }

  validatePP() {
    if (!this.email || !this.password) { return false; }
    else { return true; }
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
