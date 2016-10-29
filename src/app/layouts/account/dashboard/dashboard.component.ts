import { Component } from '@angular/core';
import { SessionService } from '../../../services/session.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  user: any;

  constructor(private session: SessionService) {
    session.pullPlanData();
    this.user = session.user;
  }
}
