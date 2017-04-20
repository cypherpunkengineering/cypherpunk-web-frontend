import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {
  alert: {
    header: string,
    body: string,
    visible: boolean
  };

  constructor() {
    this.alert = {
      header: '',
      body: '',
      visible: false
    };
  }

  success(message: string): void {
    this.alert.header = 'Success';
    this.alert.body = message;
    this.alert.visible = true;
  }

  warning(message: string): void {
    this.alert.header = 'Warning';
    this.alert.body = message;
    this.alert.visible = true;
  }

  error(message: string): void {
    this.alert.header = 'Error';
    this.alert.body = message;
    this.alert.visible = true;
  }

  dismiss(): void { this.alert.visible = false; }
}
