import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'About Cypherpunk Privacy',
      description: 'Learn about Cypherpunk Privacy and the people behind it.',
      url: '/about/assets'
    });
  }
}
