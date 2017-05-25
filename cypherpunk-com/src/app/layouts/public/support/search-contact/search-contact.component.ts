import { Component } from '@angular/core';

@Component({
  selector: 'search-contact',
  templateUrl: './search-contact.component.html',
  styleUrls: ['./search-contact.component.css']
})
export class SearchContactComponent {
  showContactForm = { show: false };

  constructor() { }

  contactForm() {
    this.showContactForm.show = true;
  }
}
