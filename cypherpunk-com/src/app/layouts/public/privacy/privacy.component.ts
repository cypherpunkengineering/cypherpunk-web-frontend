import { Component } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy Policy',
      description: 'Privacy Policy for Cypherpunk.com, a provider of VPN and privacy apps.',
      url: '/privacy-policy'
    });
  }
}
