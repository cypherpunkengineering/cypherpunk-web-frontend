import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './support-mac.component.html',
  styleUrls: ['./support-mac.component.css']
})
export class SupportMacComponent {
  constructor(private seo: SeoService, private router: Router) {
    let seoUrl = '/support/';
    let url = router.routerState.snapshot.url;
    if (url.toLowerCase().indexOf('macos') > -1) { seoUrl = seoUrl + 'macos'; }
    else { seoUrl = seoUrl + 'mac'; }
    seo.updateMeta({
      title: 'Cypherpunk Privacy Support For MacOS',
      description: 'Help, support, download link and setup guides for the Cypherpunk Privacy MacOS app.',
      url: seoUrl
    });
  }
}
