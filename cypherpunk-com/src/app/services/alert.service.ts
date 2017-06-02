import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class AlertService {
  alert: {
    header: string,
    body: string,
    visible: boolean
  };

  constructor(private zone: NgZone) {
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

  dismiss(): void {
    this.zone.run(() => {
      this.alert.visible = false;
    });
  }
}
