import { Component } from '@angular/core';
import { Alert, AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  alerts: Alert[] = [];

  constructor(private alertService: AlertService) {
    this.alerts = alertService.alerts;
  }

  dismiss(index) {
    this.alertService.dismiss(index);
  }

}
