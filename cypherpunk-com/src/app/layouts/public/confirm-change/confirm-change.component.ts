import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { ConfirmChangeGuard } from '../../../services/confirm-change-guard.service';

@Component({
  templateUrl: './confirm-change.component.html',
  styleUrls: ['./confirm-change.component.css']
})
export class ConfirmChangeComponent {

  constructor(
    private router: Router,
    private seo: SeoService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private confirmChangeGuard: ConfirmChangeGuard,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    seo.updateMeta({
      title: 'Email Change Confirmation | Cypherpunk Privacy',
      description: ' ',
      url: '/confirmChange'
    });

    // replace history and confirm guard
    if (isPlatformBrowser(this.platformId)) {
      history.replaceState({}, document.title, document.location.origin);

      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.confirmChangeGuard.canActivate(route, state)
      .then(() => { this.router.navigate(['account', {queryParams: {emailupdated: true}}]); })
      .catch(() => { this.alertService.error('Could not update your email'); });
    }
  }
}
