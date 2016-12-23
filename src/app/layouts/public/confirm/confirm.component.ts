import { Component } from '@angular/core';
import { isBrowser } from 'angular2-universal';
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
    private activatedRoute: ActivatedRoute
  ) {
    if (isBrowser) {
      history.replaceState({}, document.title, document.location.origin);

      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.confirmGuard.canActivate(route, state);
    }
  }
}
