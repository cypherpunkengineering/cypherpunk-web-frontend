import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './android.component.html',
  styleUrls: ['./android.component.css']
})
export class AndroidComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Cypherpunk Android VPN & Online Privacy App';
  }
}
