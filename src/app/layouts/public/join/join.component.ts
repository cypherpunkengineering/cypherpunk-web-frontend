import { Component, NgZone } from '@angular/core';

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

  constructor(private _zone: NgZone) {}

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
      console.log(token);

      // probably calls server at this point

      this._zone.run(() => {
        if (status === 200) { this.message = `Success! Card token created.`; }
        else { this.message = response.error.message; }
      });
    };

    // load up stripe and create token
    let stripe = (<any>window).Stripe;
    stripe.card.createToken(stripeParams, stripeCallback);
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
