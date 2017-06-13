import { Component, Input } from '@angular/core';

@Component({
  selector: 'account-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class AccountBillingComponent {
  transactions = [
    {
      date: '05/03/2016',
      plan: '12 Months',
      total: '$12.95',
      method: 'Credit Card',
      receiptUrl: 'http://www.google.com'
    },
    {
      date: '05/03/2016',
      plan: '12 Months',
      total: '$12.95',
      method: 'Credit Card',
      receiptUrl: 'http://www.google.com'
    },
    {
      date: '05/03/2016',
      plan: '12 Months',
      total: '$12.95',
      method: 'Credit Card',
      receiptUrl: 'http://www.google.com'
    }
  ];

  invoices = [
    {
      date: '05/03/2016',
      plan: '12 Months',
      total: '$12.95',
      method: 'Credit Card',
      receiptUrl: 'http://www.google.com'
    }
  ];

  transactionsLastPage: number;
  transactionsCurrentPage: number;
  invoicesLastPage: number;
  invoicesCurrentPage: number;

  constructor() { }

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

  previousInvoicesDisabled() {
    let disabled = false;
    if (this.invoicesCurrentPage <= 1) { disabled = true; }
    return disabled;
  }

  nextInvoicesDisabled() {
    let disabled = false;
    if (this.invoicesCurrentPage >= this.invoicesLastPage) { disabled = true; }
    return disabled;
  }

  goToInvoicesPage(direction: string, sortPriority?: string) {
    /* copy resolve function from resolver to here */
  }

}
