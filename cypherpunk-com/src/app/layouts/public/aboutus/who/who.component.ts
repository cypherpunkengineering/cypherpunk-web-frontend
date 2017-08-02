import { Component, Inject } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './who.component.html',
  styleUrls: ['./who.component.css']
})
export class WhoComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'About Cypherpunk Privacy',
      description: 'Learn about Cypherpunk Privacy and the people behind it.',
      url: '/about/who-we-are'
    });
  }
}
