import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PlansService } from '../../services/plans.service';

@Component({
  selector: 'app-price-boxes',
  templateUrl: './price-boxes.component.html',
  styleUrls: ['./price-boxes.component.css']
})
export class PriceBoxesComponent {
  @Input() upgrade: boolean;

  // payment plans
  plans = this.plansService.plans;
  selectedPlan = this.plansService.selectedPlan;

  constructor(
    private plansService: PlansService,
    private router: Router) { }

  selectPlan(plan) {
    this.plansService.selectedPlan = plan;
    this.selectedPlan = plan;

    if (this.upgrade) {
      this.router.navigate(['/account/upgrade']);
    }
  }

}
