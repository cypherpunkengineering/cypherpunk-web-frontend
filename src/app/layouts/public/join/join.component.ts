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
  // Stripe variables
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  message: string;

  // user variables
  email: string;
  password: string;
  name: string;
  country: string;
  address: string;
  zipCode: string;

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
      total: 75.00,
      yearly: '$ 75 billed annually',
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
    }
  ];

  selectedOption = this.paymentOptions[0];

  constructor(
    private alertService: AlertService,
    private auth: AuthService,
    private session: SessionService,
    private router: Router,
    private http: Http
  ) {}

  getToken() {
    // show user we're charging the card
    this.message = 'Loading...';

    // stripe params
    let stripeParams = {
      number: this.cardNumber,
      exp_month: this.expiryMonth,
      exp_year: this.expiryYear,
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
