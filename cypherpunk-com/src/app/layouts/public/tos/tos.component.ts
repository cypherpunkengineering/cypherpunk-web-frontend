import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './tos.component.html',
  styleUrls: ['./tos.component.css']
})
export class TosComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Cypherpunk Terms of Service';
  }
}
