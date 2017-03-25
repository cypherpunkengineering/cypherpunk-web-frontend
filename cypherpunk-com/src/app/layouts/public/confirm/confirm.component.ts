import { isBrowser } from 'angular2-universal';
import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmGuard } from '../../../services/confirm-guard.service';

@Component({
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {

  constructor(
    private router: Router,
    private confirmGuard: ConfirmGuard,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any
  ) {
    // handle title
    this.document.title = 'Confirmation | Cypherpunk Privacy';

    // replace history and confirm guard
    if (isBrowser) {
      history.replaceState({}, document.title, document.location.origin);

      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.confirmGuard.canActivate(route, state);
    }
  }
}
