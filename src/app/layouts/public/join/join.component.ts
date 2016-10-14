import { Component } from '@angular/core';

@Component({
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent {
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

  // customer information

  customerInfo = {
    email: '',
    name: ''
  };

  billingInfo = {
    ccNumber: '',
    expiration: '',
    ccCode: '',
    country: '',
    address: '',
    zipCode: ''
  };

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

  // submit function

  charge() {
    console.log(this.customerInfo);
    console.log(this.billingInfo);
    console.log(this.selectedModel);
    console.log(this.selectedOption);
  }

}
