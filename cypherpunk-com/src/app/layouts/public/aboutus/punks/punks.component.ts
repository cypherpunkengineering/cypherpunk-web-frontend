import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './punks.component.html',
  styleUrls: ['./punks.component.css']
})
export class PunksComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'About Cypherpunk Privacy',
      description: 'Learn about Cypherpunk Privacy and the people behind it.',
      url: '/about/punks'
    });
  }
}
