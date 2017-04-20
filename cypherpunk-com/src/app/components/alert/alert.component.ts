import { Component } from '@angular/core';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  alert: any;

  constructor(private alertService: AlertService) {
    this.alert = alertService.alert;
  }

  dismiss() { this.alertService.dismiss(); }

}
