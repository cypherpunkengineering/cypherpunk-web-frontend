import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './ios.component.html',
  styleUrls: ['./ios.component.css']
})
export class IosComponent {
  switch1: boolean = true;
  switch2: boolean = true;
  switch3: boolean = true;

  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Cypherpunk iOS VPN & Online Privacy App';
  }
}
