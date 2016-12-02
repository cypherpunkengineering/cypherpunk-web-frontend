import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

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
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data: any) => {
        /*
          Update local vars here
        */

        this.transactionsLastPage = 1;
        this.transactionsCurrentPage = 1;
        this.invoicesLastPage = 1;
        this.invoicesCurrentPage = 1;
      },
      (error: any) => { console.log(error); }
    );
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

  goToTransactionsPage(direction: string, sortPriority: string) {
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

  goToInvoicesPage(direction: string, sortPriority: string) {
    /* copy resolve function from resolver to here */
  }

}
