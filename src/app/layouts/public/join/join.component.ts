import { Component, NgZone } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
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

  constructor(private auth: AuthService, private router: Router, private _zone: NgZone, private http: Http) {}

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
      this.message = 'Success!';
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
      email: this.email
    };

    let _zone = this._zone;
    let message = this.message;
    let router = this.router;
    let auth = this.auth;

    // call server at this point (using promises)
    let url = '/api/subscription/purchase';
    let body = serverParams;
    let options = new RequestOptions({});
    return this.http.post(url, body, options).toPromise()
    // extract data from response
    .then(function(res: Response) {
      let resBody = res.json();
      return resBody || {};
    })
    .then(function() { auth.authed = true; })
    // update view
    .then(function(data) {
      _zone.run(() => {
        message = `Success!.`;
        router.navigate(['/user']);
      });
    })
    // handle errors
    .catch(function(error) {
      _zone.run(() => {
        message = error.message;
        console.log(error);
        // 409 - > redict to login page
        router.navigate(['/']);
      });
    });
  }

  // pricing functions

  selectPricing(model) {
    this.selectedModel = model;
    this.priceModels.map(function(item) {
      item.selected = false;
    });
    model.selected = true;
  }

  // option functions

  selectOption(option) {
    this.selectedOption = option;
    this.paymentOptions.map(function(item) {
      item.selected = false;
    });
    option.selected = true;
  }

}
