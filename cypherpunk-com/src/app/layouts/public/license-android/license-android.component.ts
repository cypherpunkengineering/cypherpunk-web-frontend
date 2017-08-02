import { Component } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  templateUrl: './license-android.component.html',
  styleUrls: ['./license-android.component.css']
})
export class LicenseAndroidComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy Android License',
      description: 'Cypherpunk Privacy Android License',
      url: '/legal/license/android'
    });
  }
}
