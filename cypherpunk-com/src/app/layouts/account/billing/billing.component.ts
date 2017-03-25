import { isBrowser } from 'angular2-universal';
import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthGuard } from '../../../services/auth-guard.service';

@Component({
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {

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

  constructor(
    private router: Router,
    private authGuard: AuthGuard,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any
  ) {
    // handle title
    this.document.title = 'Billing | Cypherpunk Privacy';

    // check user account
    if (isBrowser) {
      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.authGuard.canActivate(route, state)
      .catch(() => {});
    }
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
