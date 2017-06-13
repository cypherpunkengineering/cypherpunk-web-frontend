import { Component, Input } from '@angular/core';

@Component({
  selector: 'account-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class AccountSubscriptionComponent {
  @Input() state;
  cancelled = false;
  showPaymentDetails = false;

  constructor() { }
}
