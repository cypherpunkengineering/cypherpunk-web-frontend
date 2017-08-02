import { Component, Inject } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './routers.component.html',
  styleUrls: ['./routers.component.css']
})
export class RoutersComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk VPN & Online Privacy App for Routers',
      description: 'Protect your Router with the Cypherpunk Router VPN & Online Privacy App.',
      url: '/apps/routers'
    });
  }
}
