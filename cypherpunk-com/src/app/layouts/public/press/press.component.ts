import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './press.component.html',
  styleUrls: ['./press.component.css']
})
export class PressComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Cypherpunk Privacy Press Area';
  }
}
