import { Component } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { SessionService } from '../../../services/session.service';
import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent {
  message: string;
  messageClass: string = '';

  // Stripe variables
  cardNumber: string;
  expiryDate: string;
  cvc: string;

  // user variables
  email: string;
  password: string;
  name: string;

  // pricing model

  priceModels = [
    {
      id: 'monthly999',
      price: 9.99,
      months: 1,
      total: 9.99,
      yearly: '$ 9.99 billed monthly',
      selected: false
    },
    {
      id: 'annually8004',
      price: 6.25,
      months: 12,
      total: 80.04,
      yearly: '$ 80.04 billed annually',
      selected: true
    },
    {
      id: 'semiannually4998',
      price: 8.33,
      months: 6,
      total: 49.98,
      yearly: '$ 49.98 billed semiannually',
      selected: false
    }
  ];

  selectedModel = this.priceModels[1];

  // payment options

  paymentOptions = [
    {
      type: 'cc',
      selected: true
    },
    {
      type: 'pp',
      selected: false
    },
    {
      type: 'bc',
      selected: false
    },
    {
      type: 'o',
      selected: false
    }
  ];

  selectedOption = this.paymentOptions[0];

  constructor(
    private alertService: AlertService,
    private auth: AuthService,
    private session: SessionService,
    private router: Router,
    private http: Http
  ) { }

  getToken() {
    if (!this.validateCC()) { return; }

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
      plan: this.selectedModel.id,
      email: this.email,
      password: this.password
    };

    // call server at this point (using promises)
    let url = '/api/subscription/purchase';
    let body = serverParams;
    let options = new RequestOptions({});
    // sets cookie
    return this.http.post(url, body, options).toPromise()
    // set user session
    .then((res: Response) => {
      let resData = res.json() || {};
      this.session.setUserData({
        email: resData.acct.email,
        secret: resData.secret
      });
    })
    // turn on authed
    .then(() => { this.auth.authed = true; })
    // alert and redirect
    .then(() => {
      this.alertService.success('You account was created!');
      this.router.navigate(['/user']);
    })
    // handle errors
    .catch((error) => {
      console.log(error);
      this.alertService.error('Could not create an account');
      // 409 - > redict to login page
      this.router.navigate(['/']);
    });
  }

  goToPaypal() { console.log('not implemented yet'); }

  goToBitPay() { console.log('not implemented yet'); }

  goToPaymentwall() { console.log('not implemented yet'); }

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

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // pricing functions

  selectPricing(model) {
    this.selectedModel = model;
    this.priceModels.map((item) => { item.selected = false; });
    model.selected = true;
  }

  // option functions

  selectOption(option) {
    this.selectedOption = option;
    this.paymentOptions.map((item) => { item.selected = false; });
    option.selected = true;
  }

}
