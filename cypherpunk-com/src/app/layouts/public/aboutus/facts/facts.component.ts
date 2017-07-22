import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject } from '@angular/core';

@Component({
  templateUrl: './facts.component.html',
  styleUrls: ['./facts.component.css']
})
export class FactsComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'About Cypherpunk Privacy';
  }
}
