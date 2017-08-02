import { Component } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  templateUrl: './tos.component.html',
  styleUrls: ['./tos.component.css']
})
export class TosComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Terms of Service',
      description: 'Terms of Service for Cypherpunk privacy service, apps and website.',
      url: '/terms-of-service'
    });
  }
}
