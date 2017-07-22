import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject } from '@angular/core';

@Component({
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'About Cypherpunk Privacy';
  }
}
