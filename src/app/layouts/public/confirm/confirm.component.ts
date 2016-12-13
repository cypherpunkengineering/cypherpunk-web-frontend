import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { isBrowser } from 'angular2-universal';

@Component({
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {

  constructor(private router: Router) {
    if (isBrowser) {
      history.replaceState({}, document.title, document.location.origin);
    }
  }
}
