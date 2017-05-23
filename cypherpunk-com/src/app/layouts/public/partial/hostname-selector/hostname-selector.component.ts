import { Component } from '@angular/core';

@Component({
  template: `<app-setup-hostname [(location)]="location"></app-setup-hostname>`
})
export class HostnameSelectorComponent {
  location = { hostname: '', display: true };

  constructor() { }
}
