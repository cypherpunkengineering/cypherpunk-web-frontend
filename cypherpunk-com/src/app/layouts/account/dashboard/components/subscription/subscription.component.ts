import { isPlatformBrowser } from '@angular/common';
import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { BackendService } from '../../../../../services/backend.service';

@Component({
  selector: 'account-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class AccountSubscriptionComponent {
  @Input() state;
  cards = [];
  cancelled = false;

  constructor(
    private backend: BackendService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      backend.cards()
      .subscribe(
        (data: any) => { this.cards = data; },
        (err) => { console.log(err); }
      );
    }
  }

  printRenewal() {
    let now = new Date();
    let plan = this.state.user.subscription.type;
    let renews = this.state.user.subscription.renews;
    let limit = (plan === 'annually' || plan === 'semiannually') ? 30 : 7;

    let exp = <Date>this.state.user.subscription.expiration || new Date(0);
    let diff = (exp.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);

    // Lifetime account
    if (this.state.user.subscription.type === 'forever') { return 'Lifetime Subscription'; }
    // Expiration expired
    else if (exp < now) {
      return `Expired on ${exp.getMonth() + 1}/${exp.getDate()}/${exp.getFullYear()}`;
    }
    // Close to expiration
    else if (diff <= limit) {
      return (renews ? 'Renews ' : 'Expires ') + this.printTimeDiff(exp, now);
    }
    // Annual plan
    else if (plan === 'annually') { return '12 Month Plan'; }
    // Semiannual Plan
    else if (plan === 'semiannually') { return '6 Month Plan'; }
    // Monthly Plan
    else if (plan === 'monthly') { return '1 Month Plan'; }
    // errrr....
    else { return ''; }
  }

  printTimeDiff(expiration, now) {
    let diff = (expiration.getTime() - now.getTime()) / (60 * 60 * 1000); // hours

    if (diff < 0) {
      diff = -diff;
      if (diff < 1) { return 'just now'; }
      else if (diff <= 2) { return 'an hour ago'; }
      else if (diff < 6) { return 'less than six hours ago'; }
      else if (diff <= 2 * 24) {
        if (expiration.getDate() === now.getDate()) { return 'today'; }
        let yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (expiration.getDate() === yesterday.getDate()) { return 'yesterday'; }
      }

      if (diff <= 30 * 24) { return `${Math.ceil(diff / 24).toFixed()} days ago`; }
      else if (diff <= 50 * 24) { return `${Math.ceil(diff / (7 * 24)).toFixed()} weeks ago`; }
      else if (diff <= 300 * 24) { return `${Math.ceil(diff / (30 * 24)).toFixed()} months ago`; }
      else if (diff <= 400 * 24) { return 'a year ago'; }
      else { return 'over a year ago'; }
    }
    else {
      if (diff < 1) { return 'in less than an hour'; }
      else if (diff < 6) { return 'in less than six hours'; }
      else if (diff <= 2 * 24) {
        if (expiration.getDate() === now.getDate()) { return 'today'; }
        let tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        if (expiration.getDate() === tomorrow.getDate()) { return 'tomorrow'; }
      }
      if (diff <= 30 * 24) { return `in ${Math.ceil(diff / 24).toFixed()} days`; }
      else if (diff <= 50 * 24) { return `in ${Math.ceil(diff / (7 * 24)).toFixed()} weeks`; }
      else if (diff <= 300 * 24) { return `in ${Math.ceil(diff / (30 * 24)).toFixed()} months`; }
      else if (diff <= 400 * 24) { return 'in one year'; }
      else { return 'in over a year'; }
    }
  }
}
