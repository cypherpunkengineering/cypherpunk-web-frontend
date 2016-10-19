import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user = {
    email: 'test@example.com',
    status: 'active',
    period: '6 months',
    renewalDate: '2017-03-03T03:24:00'
  };

  daysLeft = 0;

  ngOnInit() {
    let now = new Date();
    let renewalDate = new Date(this.user.renewalDate);
    let oneDay = 24 * 60 * 60 * 1000;
    this.daysLeft = Math.round(Math.abs(now.getTime() - renewalDate.getTime()) / (oneDay));
  }
}
