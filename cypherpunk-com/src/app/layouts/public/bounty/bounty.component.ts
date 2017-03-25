import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './bounty.component.html',
  styleUrls: ['./bounty.component.css']
})
export class BountyComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Bug Bounty Program by Cypherpunk Privacy';
  }
}
