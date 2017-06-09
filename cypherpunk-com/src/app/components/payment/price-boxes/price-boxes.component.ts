import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { PlansService } from '../../../services/plans.service';
import { SessionService } from '../../../services/session.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Input, Inject, PLATFORM_ID, OnChanges } from '@angular/core';

@Component({
  selector: 'app-price-boxes',
  templateUrl: './price-boxes.component.html',
  styleUrls: ['./price-boxes.component.css']
})
export class PriceBoxesComponent implements OnChanges {
  @Input() upgrade: boolean;
  @Input() btc: boolean;
  @Input() planData;
  bpRate: number;
  plans = [];
  user;

  constructor(
    private http: Http,
    private router: Router,
    private session: SessionService,
    private plansService: PlansService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnChanges() { this.updatePlans(); }

  updatePlans() {
    // load plan data
    this.user = this.session.user;
    this.plans = this.planData.plans;
    this.plansService.setPlanVisibility(this.user.subscription.renewal, this.user.account.type);

    // get rates for bitpay
    if (isPlatformBrowser(this.platformId)) {
      let url = 'https://bitpay.com/api/rates/usd';
      this.http.get(url)
      .map(res => res.json())
      .subscribe((data: any) => {
        if (data.rate) { this.bpRate = data.rate; }
        if (this.plans[0]) { this.plans[0].bcPrice = this.bpConvert(this.plans[0].price); }
        if (this.plans[1]) { this.plans[1].bcPrice = this.bpConvert(this.plans[1].price); }
        if (this.plans[2]) { this.plans[2].bcPrice = this.bpConvert(this.plans[2].price); }
      });
    }
  }

  bpConvert(usd: number): number {
    if (this.bpRate) { return +(usd / this.bpRate).toFixed(8); }
    else { return -1; }
  }

  selectPlan(plan) {
    this.planData.selected = plan;
    if (this.upgrade) {
      this.plansService.selectedPlanId = plan.id;
      this.router.navigate(['/account/upgrade']);
    }
  }
}
