import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject } from '@angular/core';

@Component({
  templateUrl: './inquiries.component.html',
  styleUrls: ['./inquiries.component.css']
})
export class InquiriesComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'About Cypherpunk Privacy';
  }
}
