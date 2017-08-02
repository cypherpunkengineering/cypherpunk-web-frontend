import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './support-browser-extension.component.html',
  styleUrls: ['./support-browser-extension.component.css']
})
export class SupportBrowserExtensionComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy Support For Chrome, Firefox, Opera, Vivaldi',
      description: 'Help, support, download link and setup guides for the Cypherpunk Privacy Browser Extensions.',
      url: '/support/browsers'
    });
  }
}
