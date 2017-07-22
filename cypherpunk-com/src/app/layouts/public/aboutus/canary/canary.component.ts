import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject } from '@angular/core';

@Component({
  templateUrl: './canary.component.html',
  styleUrls: ['./canary.component.css']
})
export class CanaryComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'About Cypherpunk Privacy';
  }
}
