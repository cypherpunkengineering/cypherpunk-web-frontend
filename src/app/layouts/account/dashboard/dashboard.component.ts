import { Component } from '@angular/core';
import { SessionService } from '../../../services/session.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  user: any;
  daysLeft: number = 0;

  constructor(private session: SessionService) {
    this.user = session.user;

    let now = new Date();
    let renewalDate = new Date(this.user.renewalDate);
    let oneDay = 24 * 60 * 60 * 1000;
    this.daysLeft = Math.round(Math.abs(now.getTime() - renewalDate.getTime()) / (oneDay));
  }
}
