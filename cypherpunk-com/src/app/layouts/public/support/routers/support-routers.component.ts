import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './support-routers.component.html',
  styleUrls: ['./support-routers.component.css']
})
export class SupportRoutersComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy Support For Routers',
      description: 'Help, support, download link and setup guides for installing Cypherpunk Privacy on Routers.',
      url: '/support/routers'
    });
  }
}
