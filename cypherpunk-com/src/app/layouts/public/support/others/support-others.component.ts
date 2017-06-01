import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './support-others.component.html',
  styleUrls: ['./support-others.component.css']
})
export class SupportOthersComponent {

  constructor(
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Cypherpunk Privacy Support'; }
}
