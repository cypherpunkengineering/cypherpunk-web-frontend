import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as platform from 'platform';

@Component({ template: '' })
export class AppsComponent {

  constructor(private router: Router) {
    // detect os setup
    let os: string = platform.os.family;
    if (os.indexOf('OS X') > -1) { router.navigate(['/apps/mac']); }
    else if (os.indexOf('Window') > -1) { router.navigate(['/apps/windows']); }
    else if (os.indexOf('Fedora') > -1 ||
             os.indexOf('Red Hat') > -1 ||
             os.indexOf('CentOS') > -1 ||
             os.indexOf('Debian') > -1 ||
             os.indexOf ('Ubuntu') > -1 ||
             os.indexOf ('Kubuntu') > -1 ||
             os.indexOf ('Xubuntu') > -1 ||
             os.indexOf('Mint')) {
      router.navigate(['/apps/linux']);
    }
    else { router.navigate(['/apps/windows']); }
  }
}
