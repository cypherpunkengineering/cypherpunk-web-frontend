import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Cypherpunk Privacy Policy';
  }
}
