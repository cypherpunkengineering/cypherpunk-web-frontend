import { Component } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { SessionService } from '../../../services/session.service';
import { PlansService } from '../../../services/plans.service';
import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent {
  message: string;
  messageClass: string = '';

  // Stripe variables
  cardNumber: string;
  expiryDate: string;
  cvc: string;

  // user variables
  email: string;
  name: string;

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
    private http: Http,
    private router: Router,
    private auth: AuthService,
    private session: SessionService,
    private alertService: AlertService,
    private plansService: PlansService
  ) { this.email = session.user.email; }

  getToken() {
    if (!this.validateCC()) { return; }

    // show user we're charging the card
    this.message = 'Loading...';

    let month: number;
    let year: number;

    console.log(this.expiryDate);

    month = Number(this.expiryDate.split('/')[0]);
    year = Number(this.expiryDate.split('/')[1]);

    console.log(month);
    console.log(year);

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
    let url = '/api/subscription/upgrade';
    let body = serverParams;
    let options = new RequestOptions({});
    // set cookie?
    return this.http.post(url, body, options).toPromise()
    .then(() => { this.auth.authed = true; })
    // alert and redirect
    .then(() => {
      this.alertService.success('You have upgraded your account');
      this.router.navigate(['/user']);
    })
    // handle errors
    .catch((error) => {
      console.log(error);
      this.alertService.error('You account could not be upgraded');
      // error 409 -> redirect to login page
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

  // option functions

  selectOption(option) {
    this.selectedOption = option;
    this.paymentOptions.map((item) => { item.selected = false; });
    option.selected = true;
  }

}
