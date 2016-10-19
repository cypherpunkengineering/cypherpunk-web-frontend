import { Component } from '@angular/core';

@Component({
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
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
}
