import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './canary.component.html',
  styleUrls: ['./canary.component.css']
})
export class CanaryComponent {
  now = new Date();

  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'About Cypherpunk Privacy',
      description: 'Learn about Cypherpunk Privacy and the people behind it.',
      url: '/about/canary'
    });
  }
}
