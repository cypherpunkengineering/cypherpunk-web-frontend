import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { AuthGuard } from '../../../services/auth-guard.service';

@Component({
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent {
  loading = true;
  vpnSelect = 'openvpn';
  openvpnLocation = { hostname: '', display: false };
  ipsecLocation = { hostname: '', display: true };
  ikeLocation = { hostname: '', display: true };
  httpLocation = { hostname: '', display: true };

  constructor(
    private router: Router,
    private authGuard: AuthGuard,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // handle title
    this.document.title = 'Setup Cypherpunk Privacy';

    if (isPlatformBrowser(this.platformId)) {
      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.authGuard.canActivate(route, state)
      .then((data) => { this.loading = false; })
      .catch(() => {});
    }
  }
}
