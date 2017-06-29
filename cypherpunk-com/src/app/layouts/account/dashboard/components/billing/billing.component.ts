import { Component, Input } from '@angular/core';
import { BackendService } from '../../../../../services/backend.service';

@Component({
  selector: 'account-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class AccountBillingComponent {
  transactions = {
    receipts: [
      {
        id: '',
        date: '05/03/2016',
        description: '12 Months',
        method: 'Credit Card',
        currency: 'USD',
        amount: '$12.95',
        receiptUrl: 'http://www.google.com'
      }
    ]
  };

  transactionsLastPage: number;
  transactionsCurrentPage: number;

  constructor(private backend: BackendService) {
    this.backend.billingReceipts({})
    .then((data) => {
      this.transactions = data;
    });
  }

  trackTransactions(index, hero) {
    return hero ? hero.id : undefined;
  }

  previousTransactionsDisabled() {
    let disabled = false;
    if (this.transactionsCurrentPage <= 1) { disabled = true; }
    return disabled;
  }

  nextTransactionsDisabled() {
    let disabled = false;
    if (this.transactionsCurrentPage >= this.transactionsLastPage) { disabled = true; }
    return disabled;
  }

  goToTransactionsPage(direction: string, sortPriority?: string) {
    /* copy resolve function from resolver to here */
  }
}
