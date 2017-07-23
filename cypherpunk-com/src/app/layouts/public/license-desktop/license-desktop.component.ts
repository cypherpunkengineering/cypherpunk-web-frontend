import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './license-desktop.component.html',
  styleUrls: ['./license-desktop.component.css']
})
export class LicenseDesktopComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Cypherpunk License Information';
  }
}
