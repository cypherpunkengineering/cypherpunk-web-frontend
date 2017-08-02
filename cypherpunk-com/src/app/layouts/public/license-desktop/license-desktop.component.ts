import { Component } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  templateUrl: './license-desktop.component.html',
  styleUrls: ['./license-desktop.component.css']
})
export class LicenseDesktopComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy Desktop License',
      description: 'Cypherpunk Privacy Desktop License',
      url: '/legal/license/desktop'
    });
  }
}
