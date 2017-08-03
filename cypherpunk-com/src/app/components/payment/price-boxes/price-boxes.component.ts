import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { PlansService } from '../../../services/plans.service';
import { SessionService } from '../../../services/session.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Input, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-price-boxes',
  templateUrl: './price-boxes.component.html',
  styleUrls: ['./price-boxes.component.css']
})
export class PriceBoxesComponent implements OnDestroy {
  @Input() upgrade: boolean;
  @Input() btc: boolean;
  @Input() showOverride: boolean;

  user;
  plansSrv;
  plans = [];
  planSubscriber;
  bpRate: number;
  bpConvertUrl = 'https://bitpay.com/api/rates/usd';

  constructor(
    private http: Http,
    private router: Router,
    private session: SessionService,
    private plansService: PlansService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.user = this.session.user;
    this.plans = plansService.plans;
    this.plansSrv = plansService;
    this.planSubscriber = plansService.getObservablePlans().subscribe((plans) => {
      this.updatePlans();
    });

    // get rates for bitpay
    if (isPlatformBrowser(this.platformId)) {
      let url = 'https://bitpay.com/api/rates/usd';
      this.http.get(url)
      .map(res => res.json())
      .subscribe((data: any) => { if (data.rate) { this.bpRate = data.rate; } });
    }
  }

  updatePlans() {
    // load plan data
    let subType = this.user.subscription.type;
    let accountType = this.user.account.type;
    let renews = this.user.subscription.renews;
    this.plansService.setPlanVisibility(subType, accountType, renews, this.showOverride);

    // update bp numbers
    if (this.plans[0]) { this.plans[0].bcPrice = this.bpConvert(this.plans[0].price); }
    if (this.plans[1]) { this.plans[1].bcPrice = this.bpConvert(this.plans[1].price); }
    if (this.plans[2]) { this.plans[2].bcPrice = this.bpConvert(this.plans[2].price); }
  }

  bpConvert(usd: number): number {
    if (this.bpRate) { return +(usd / this.bpRate).toFixed(8); }
    else { return -1; }
  }

  selectPlan(plan) {
    if (this.showOverride) { return; }
    this.plansService.selectedPlan = plan;
    if (this.upgrade) { this.router.navigate(['/account/upgrade']); }
  }

  ngOnDestroy() { this.planSubscriber.unsubscribe(); }
}
