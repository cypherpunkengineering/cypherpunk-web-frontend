import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './whyus.component.html',
  styleUrls: ['./whyus.component.css']
})
export class WhyusComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Why You Need Cypherpunk Privacy & VPN Service';
  }
}
