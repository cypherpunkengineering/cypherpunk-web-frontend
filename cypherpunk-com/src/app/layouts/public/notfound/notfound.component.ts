import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotFoundComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Page Not Found | Cypherpunk Privacy';
  }
}
