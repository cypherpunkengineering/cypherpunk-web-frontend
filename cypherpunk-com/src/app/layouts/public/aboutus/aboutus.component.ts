import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'About Cypherpunk Privacy';
  }
}
