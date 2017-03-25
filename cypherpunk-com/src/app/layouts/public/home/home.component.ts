import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Cypherpunk Privacy Apps & VPN Service';
  }
}
