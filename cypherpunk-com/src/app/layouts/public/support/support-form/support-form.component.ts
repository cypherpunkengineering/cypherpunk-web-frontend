import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject } from '@angular/core';

@Component({
  templateUrl: './support-form.component.html',
  styleUrls: ['./support-form.component.css']
})
export class SupportFormComponent {
  posts = [];
  display = { show: true };

  constructor(
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Cypherpunk Privacy Support'; }
}
