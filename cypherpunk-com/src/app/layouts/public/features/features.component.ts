import { Component } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy Features',
      description: 'Learn which VPN and privacy features Cypherpunk uses to keep you safe online, from home and on public Wi-Fi.',
      url: '/features'
    });
  }
}
