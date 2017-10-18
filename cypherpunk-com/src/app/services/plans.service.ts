import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Plan {
  id: string;
  type: string;
  price: number;
  bcPrice: number;
  rate: string;
  months: number;
  viewable: boolean;
  bitpayData: string;
  paypalButtonId: string;

  constructor(id, type, price, rate, months, viewable, bitpayData, paypalButtonId) {
    this.id = id;
    this.type = type;
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
  plans: Plan[] = [];
  selectedPlan: Plan;
  defaultPlans: Plan[] = []
  defaultSelectedPlan: Plan;
  referralPlans: Plan[] = [];
  referralSelectedPlan: Plan;
  _plans: BehaviorSubject<Plan[]>;
  referralCode = '';

  constructor(private backend: BackendService) {
    this._plans = new BehaviorSubject(this.plans);
    this.getPlans();
  }

  getPlans(referralCode?) {
    if (referralCode) { this.referralCode = referralCode; }
    // Grab plan data from backend
    let code = referralCode || '';
    return this.backend.pricingPlans(code, {})
    .then((plans) => {
      this.insertPlans(plans, referralCode);
      this.selectedPlan = this.plans[1];

      // guard against multiple calls to plans api with referral code
      // this should only allow the referralCode request to emit
      let emit = false;
      if (!this.referralCode) { emit = true }
      else if (this.referralCode && referralCode) { emit = true; }
      if (emit) { this._plans.next(this.plans); }
    })
    .catch((err) => {
      console.log('Could not pull pricing plans, defaulting');
      console.log(err);
    });
  }

  getObservablePlans() {
    return this._plans.asObservable();
  }

  private insertPlans(plans, referralCode?) {
    let planArray = this.defaultPlans;
    if (referralCode) { planArray = this.referralPlans; }

    // clear old plans
    while (planArray.length) { planArray.shift(); }

    // monthly plan
    planArray.push({
      id: plans.monthly.id,
      type: 'monthly',
      price: Number(plans.monthly.price),
      bcPrice: undefined,
      rate: 'monthly plan',
      months: 1,
      viewable: true,
      bitpayData: plans.monthly.bitpayPlanId,
      paypalButtonId: plans.monthly.paypalPlanId
    });
    // annual plan
    planArray.push({
      id: plans.annually.id,
      type: 'annually',
      price: Number(plans.annually.price),
      bcPrice: undefined,
      rate: '12 month plan',
      months: 12,
      viewable: true,
      bitpayData: plans.annually.bitpayPlanId,
      paypalButtonId: plans.annually.paypalPlanId
    });
    // semiannual plan
    planArray.push({
      id: plans.semiannually.id,
      type: 'semiannually',
      price: Number(plans.semiannually.price),
      bcPrice: undefined,
      rate: '6 month plan',
      months: 6,
      viewable: true,
      bitpayData: plans.semiannually.bitpayPlanId,
      paypalButtonId: plans.semiannually.paypalPlanId
    });

    if (referralCode) { this.useReferralPlans(); }
    else { this.useDefaultPlans(); }

    return planArray;
  }

  useDefaultPlans(emit?: boolean) {
    while (this.plans.length) { this.plans.shift(); }
    this.defaultPlans.forEach((plan) => { this.plans.push(plan); });
    if (emit) { this._plans.next(this.plans); }
  }

  useReferralPlans(emit?: boolean) {
    while (this.plans.length) { this.plans.shift(); }
    this.referralPlans.forEach((plan) => { this.plans.push(plan); });
    if (emit) { this._plans.next(this.plans); }
  }

  setPlanVisibility(planCode, userType, renews): void {
    if (planCode === 'forever') {
      this.plans.map((plan) => { plan.viewable = false; });
    }
    else if (userType === 'free' || userType === 'expired' || !renews) {
      this.plans.map((plan) => { plan.viewable = true; });
    }
    else if (planCode === 'monthly') {
      if (this.plans[0]) { this.plans[0].viewable = false; }
      if (this.plans[1]) { this.plans[1].viewable = true; }
      if (this.plans[2]) { this.plans[2].viewable = true; }
    }
    else if (planCode === 'semiannually') {
      if (this.plans[0]) { this.plans[0].viewable = false; }
      if (this.plans[1]) { this.plans[1].viewable = true; }
      if (this.plans[2]) { this.plans[2].viewable = false; }
    }
    else if (planCode === 'annually') {
      this.plans.map((plan) => { plan.viewable = false; });
    }
    else {
      this.plans.map((plan) => { plan.viewable = true; });
    }
  }
}
