import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './routers.component.html',
  styleUrls: ['./routers.component.css']
})
export class RoutersComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Cypherpunk VPN & Online Privacy App for Routers';
  }
}
