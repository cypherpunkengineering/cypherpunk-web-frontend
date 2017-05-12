import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './mac.component.html',
  styleUrls: ['./mac.component.css']
})
export class MacComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Cypherpunk Mac VPN & Online Privacy App';
  }
}
