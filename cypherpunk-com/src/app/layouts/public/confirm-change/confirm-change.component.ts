import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { ConfirmChangeGuard } from '../../../services/confirm-change-guard.service';

@Component({
  templateUrl: './confirm-change.component.html',
  styleUrls: ['./confirm-change.component.css']
})
export class ConfirmChangeComponent {

  constructor(
    private router: Router,
    private confirmChangeGuard: ConfirmChangeGuard,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // handle title
    this.document.title = 'Email Change Confirmation | Cypherpunk Privacy';

    // replace history and confirm guard
    if (isPlatformBrowser(this.platformId)) {
      history.replaceState({}, document.title, document.location.origin);

      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.confirmChangeGuard.canActivate(route, state);
    }
  }
}