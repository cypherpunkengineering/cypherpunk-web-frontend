import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { ConfirmGuard } from '../../../services/confirm-guard.service';

@Component({
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {

  constructor(
    private router: Router,
    private seo: SeoService,
    private confirmGuard: ConfirmGuard,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    seo.updateMeta({
      title: 'Confirmation | Cypherpunk Privacy',
      description: ' ',
      url: '/confirm' // handle confirmation url?
    });

    // replace history and confirm guard
    if (isPlatformBrowser(this.platformId)) {
      history.replaceState({}, document.title, document.location.origin);

      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.confirmGuard.canActivate(route, state)
      .then(() => { this.router.navigate(['account', {queryParams: {confirmed: true}}]); })
      .catch(() => { this.alertService.error('Could not confirm your account'); });
    }
  }
}
