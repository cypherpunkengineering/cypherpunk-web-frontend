import { SeoService } from '../../../services/seo.service';
import { Component, ViewChild } from '@angular/core';

@Component({
  templateUrl: './pricing-preview.component.html',
  styleUrls: ['./pricing-preview.component.css']
})
export class PricingPreviewComponent {
  @ViewChild('priceBoxes') priceBoxes;

  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy & VPN Pricing',
      description: 'Pricing for Cypherpunk Online Privacy service.',
      url: '/pricing/previews'
    });
  }
}
