import { Injectable, NgZone } from '@angular/core';

export class Plan {
  id: string;
  price: number;
  bcPrice: number;
  rate: string;
  months: number;
  viewable: boolean;
  bitpayData: string;
  paypalButtonId: string;

  constructor(id, price, rate, months, viewable, bitpayData, paypalButtonId) {
    this.id = id;
    this.price = price;
    this.bcPrice = undefined;
    this.rate = rate;
    this.months = months;
    this.viewable = viewable;
    this.bitpayData = bitpayData;
    this.paypalButtonId = paypalButtonId;
  }
}

@Injectable()
export class PlansService {
  plans: Plan[] = [
    {
      id: 'monthly',
      price: 11.95,
      bcPrice: undefined,
      rate: 'monthly plan',
      months: 1,
      viewable: true,
      bitpayData: 'rDNH1y1QGetIGfRuWqjAKXLfg/M+yFmdEmL6jDfljpyiMifqDnitepwtuBM1XWsMjPjdWULKmlk0BXobcfpM9RBG2Byp1YXm0iZnzepYwsLyVc4S5mZ09m7fyS/nE+jnp5jYgj/2aYfZd0H40aBlfItmeQrDtwU7MrqGhe5/oxLCtzeKz7n8GSp2EAn8BmrLPXyeavY02cewvv0Wn5xHwhEF/GiLUGYw52SQVKmd8hKhDHPg9dzew0l4qlhKdWTZzVwmMXfksoGfieHhpWP254xslZvnNquktHQiEJjEyfTa4SQuYxHn30cREdTwM/5royrFXSbBWLQv7ilKbwZ8Mt2feiT4z7x/qvZCDc3HCy/ym6DxS+8Ydo8F4ZAKH0tup5mYwCCELWahy6A5HR/oFw==',
      paypalButtonId: '2R5T5E59ST644'
    },
    {
      id: 'annually',
      price: 69.00,
      bcPrice: undefined,
      rate: '12 month plan',
      months: 12,
      viewable: true,
      bitpayData: 'rDNH1y1QGetIGfRuWqjAKXLfg/M+yFmdEmL6jDfljpyiMifqDnitepwtuBM1XWsMjPjdWULKmlk0BXobcfpM9RBG2Byp1YXm0iZnzepYwsK9bHfltA8K2NL6zllPKIbUbV4IJ9iGsBcNoKb464ejCfjXZBAHMuxM1rr7zfemNHJTbrp265CwdPLhwC0ESWKM9L5ZGQLD9XRbJEUtflj0YIT8V3E0wuGRJCTHx86p0ATT0bawWsXUOblqfKrBSR+J7il8P9Y+ZzOwmsBgM0zfr3jQyl3fFqBVEVqojkQG2OnH5nnXMvonhv9A1wpLzzpTgR8tmqujEdi6iIWMSOqaMFoiMC/A4iGwmt4HSvVOP6EHrLdc9rQteIUdoFyNJDzrQUm2u1NGj77quwRZlZ5p4g==',
      paypalButtonId: '2QQP8LJGKMW66'
    },
    {
      id: 'semiannually',
      price: 42.00,
      bcPrice: undefined,
      rate: '6 month plan',
      months: 6,
      viewable: true,
      bitpayData: 'rDNH1y1QGetIGfRuWqjAKXLfg/M+yFmdEmL6jDfljpyiMifqDnitepwtuBM1XWsMjPjdWULKmlk0BXobcfpM9RBG2Byp1YXm0iZnzepYwsI9crWiSZSGLIdAusz0YiYtVx6cEvkF+um2IYkK5hLpg7pV3//IaAcv3BmQrKVQq57fhxmJxDEcB9YQD34TBKJMN4HBaAulPCzjbydG6p+idrdlmOJgvqJpe7RkslU/JMSum3QAq2HHu6jptjKeqAdTyL3jlSO3xYC3Lo7Vc2yeBDbQ/YKbMlAEFAfWzcRhBT8HyveXCllF+E+T9K8JctB5vsBPk+1K5iQgl+RsUzo+48qvggrC/uX/4DTcMJQElr6mmNZvLqV7rWkP7ej0nypMXaIaUpfyuTx/Vk4ATrHuPQ==',
      paypalButtonId: 'X2FK4838HPCJC'
    }
  ];

  selectedPlan: Plan = this.plans[1];

  constructor(private zone: NgZone) { }

  setPlanVisibility (planCode, userType): void {
    if (userType === 'free') {
      this.plans.map((plan) => { plan.viewable = true; });
    }
    else if (planCode === 'monthly') {
      this.plans[0].viewable = false;
      this.plans[1].viewable = true;
      this.plans[2].viewable = true;
    }
    else if (planCode === 'semiannually') {
      this.plans[0].viewable = false;
      this.plans[1].viewable = true;
      this.plans[2].viewable = false;
    }
    else if (planCode === 'annually') {
      this.plans.map((plan) => { plan.viewable = false; });
    }
    else if (planCode === 'forever') {
      this.plans.map((plan) => { plan.viewable = false; });
    }
    else {
      this.plans.map((plan) => { plan.viewable = true; });
    }
  }
}
