import { Injectable } from '@angular/core';

export class Alert {
  type: string;
  message: string;
  constructor(type: string, message: string) {
    this.type = type;
    this.message = message;
  }
}

@Injectable()
export class AlertService {
  alerts: Alert[] = [];

  constructor() {}

  success(message: string): void {
    this.alerts.push(new Alert('success', message));
  }

  warning(message: string): void {
    this.alerts.push(new Alert('warning', message));
  }

  error(message: string): void {
    this.alerts.push(new Alert('error', message));
  }

  dismiss(index): void {
    this.alerts.splice(index, 1);
  }
}
