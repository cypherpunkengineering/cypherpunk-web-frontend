import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './support-routers.component.html',
  styleUrls: ['./support-routers.component.css']
})
export class SupportRoutersComponent {

  constructor(
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Cypherpunk Privacy Support'; }
}
