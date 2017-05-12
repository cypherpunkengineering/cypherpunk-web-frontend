import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './ios.component.html',
  styleUrls: ['./ios.component.css']
})
export class IosComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Cypherpunk iOS VPN & Online Privacy App';
  }
}
