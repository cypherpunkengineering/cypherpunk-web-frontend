import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent {
  switch1: boolean = true;
  switch2: boolean = true;
  switch3: boolean = true;

  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Download Privacy & VPN Browser Extensions from Cypherpunk Privacy';
  }
}
