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
  showPaymentDetails = false;

  constructor(
    private backend: BackendService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      backend.cards()
      .subscribe((data: any) => {
        console.log(data);
        this.cards = data.sources;
      }, () => {});
    }
  }
}
