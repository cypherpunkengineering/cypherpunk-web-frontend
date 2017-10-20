import { Component } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  templateUrl: './license-ios.component.html',
  styleUrls: ['./license-ios.component.css']
})
export class LicenseIOSComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy iOS License',
      description: 'Cypherpunk Privacy iOS License',
      url: '/legal/license/ios'
    });
  }
}
