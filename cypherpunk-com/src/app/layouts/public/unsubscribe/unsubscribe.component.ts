import { Router, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../services/seo.service';
import { BackendService } from '../../../services/backend.service';
import { Component, PLATFORM_ID, Inject, AfterViewInit, NgZone } from '@angular/core';

@Component({
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent {
  email: string = '';
  token: string = '';
  showSuccess: boolean = false;
  showError: boolean = false;

  constructor(
    private zone: NgZone,
    private router: Router,
    private seo: SeoService,
    private route: ActivatedRoute,
    private backend: BackendService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // update page meta
    seo.updateMeta({
      title: 'Unsubscribe from Cypherpunk Privacy Emails',
      description: 'Unsubscribe from Cypherpunk Privacy Emails',
      url: '/unsubscribe'
    });

    // get query params to send to backend
    let query = this.route.snapshot.queryParams;
    this.email = query['email'];
    this.token = query['token'];

    // skip out on scraping
    if (!isPlatformBrowser(this.platformId)) { return; }

    // send request to backend
    if (this.email && this.token) { this.unsubscribe(this.email, this.token); }
    else { this.router.navigate(['/']); }
  }

  unsubscribe(email: string, token: string) {
    this.backend.unsubscribe(this.email, this.token)
    .then(() => { this.showSuccess = true; })
    .catch((err) => { this.showError = true; });
  }
}
