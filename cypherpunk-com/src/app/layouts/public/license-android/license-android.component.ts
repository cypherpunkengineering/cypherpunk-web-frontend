import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './license-android.component.html',
  styleUrls: ['./license-android.component.css']
})
export class LicenseAndroidComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Cypherpunk License Information';
  }
}
