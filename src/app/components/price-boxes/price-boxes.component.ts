import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { isBrowser } from 'angular2-universal';
import { Component, Input } from '@angular/core';
import { PlansService } from '../../services/plans.service';

@Component({
  selector: 'app-price-boxes',
  templateUrl: './price-boxes.component.html',
  styleUrls: ['./price-boxes.component.css']
})
export class PriceBoxesComponent {
  @Input() upgrade: boolean;
  @Input() btc: boolean;

  bpRate: number;
  plans = this.plansService.plans;
  selectedPlan = this.plansService.selectedPlan;

  constructor(
    private http: Http,
    private router: Router,
    private plansService: PlansService
  ) {
    // get rates for bitpay
    if (isBrowser) {
      let url = 'https://bitpay.com/api/rates/usd';
      http.get(url)
      .map(res => res.json())
      .subscribe((data: any) => {
        if (data.rate) {this.bpRate = data.rate; }
        this.plans[0].bcPrice = this.bpConvert(this.plans[0].price);
        this.plans[1].bcPrice = this.bpConvert(this.plans[1].price);
        this.plans[2].bcPrice = this.bpConvert(this.plans[2].price);
        this.plans[0].bcTotal = this.bpConvert(this.plans[0].total);
        this.plans[1].bcTotal = this.bpConvert(this.plans[1].total);
        this.plans[2].bcTotal = this.bpConvert(this.plans[2].total);
        this.plans[0].bcYearly = this.plans[0].bcTotal.toString();
        this.plans[1].bcYearly = this.plans[1].bcTotal.toString();
        this.plans[2].bcYearly = this.plans[2].bcTotal.toString();
      });
    }

  }

  bpConvert(usd: number): number {
    if (this.bpRate) { return +(usd / this.bpRate).toFixed(8); }
    else { return -1; }
  }

  selectPlan(plan) {
    this.plansService.selectedPlan = plan;
    this.selectedPlan = plan;

    if (this.upgrade) {
      this.router.navigate(['/account/upgrade']);
    }
  }

}
