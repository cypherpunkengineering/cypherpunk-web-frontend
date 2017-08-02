import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './support-ios.component.html',
  styleUrls: ['./support-ios.component.css']
})
export class SupportIOSComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy Support For iOS',
      description: 'Help, support, download link and setup guides for the Cypherpunk Privacy iOS app.',
      url: '/support/ios'
    });
  }
}
