import { Component } from '@angular/core';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  user: any;
  currentTab: string = 'overview';
  loading: boolean = true;
  showEmailModal: boolean = false;
  showPasswordModal: boolean = false;

  constructor(
    private router: Router,
    private authGuard: AuthGuard,
    private session: SessionService,
    private activatedRoute: ActivatedRoute
  ) {
    this.user = this.session.user;

    let route = activatedRoute.snapshot;
    let state = router.routerState.snapshot;
    this.authGuard.canActivate(route, state)
    .then((data) => { this.loading = data.loading || false; });
  }

  openEmailModal() {
    this.showEmailModal = true;
    setTimeout(() => { document.getElementById('dashboardEmail').focus(); }, 510);
  }

  openPasswordModal() {
    this.showPasswordModal = true;
    setTimeout(() => { document.getElementById('dashboardPassword').focus(); }, 510);
  }

  switch(tab: string) {
    this.currentTab = tab;
  }
}
