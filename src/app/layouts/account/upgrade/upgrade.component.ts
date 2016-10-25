import { Component, NgZone } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent {
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
      price: 9.99,
      months: 1,
      total: 9.99,
      yearly: '&nbsp;',
      selected: false
    },
    {
      price: 6.67,
      months: 12,
      total: 80.04,
      yearly: '$ 80.04 billed yearly',
      selected: true
    },
    {
      price: 8.33,
      months: 6,
      total: 49.98,
      yearly: '$ 49.98 billed per half year',
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

  constructor(private _zone: NgZone, private http: Http) {}

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
      let token = response.card.id;
      this.message = 'Success!';
      console.log(token);
      return this.saveToServer(token);
    };

    // load up stripe and create token
    let stripe = (<any>window).Stripe;
    stripe.card.createToken(stripeParams, stripeCallback);
  }

  saveToServer(token: string) {
    let serverParams = {
      token: token,
      email: this.email,
      name: this.name,
      country: this.country,
      address: this.address,
      zipCode: this.zipCode
    };

    // call server at this point (using promises)
    let url = 'http://localhost';
    let body = JSON.stringify(serverParams);
    let headers = new Headers({});
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, body, options).toPromise()
    // extract data from response
    .then(function(res: Response) {
      let resBody = res.json();
      return resBody.data || {};
    })
    // update view
    .then(function(data) {
      this._zone.run(() => {
        this.message = `Success! Card token created.`;
      });
    })
    // handle errors
    .catch(function(error) {
      this._zone.run(() => {
        this.message = error.message;
        console.log(error);
        // error 409 -> redirect to login page
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
