import { Component } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotFoundComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Page Not Found | Cypherpunk Privacy',
      description: '404 Error: This page does not exist.',
      url: '/404'
    })
  }
}
