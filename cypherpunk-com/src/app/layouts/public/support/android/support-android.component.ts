import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './support-android.component.html',
  styleUrls: ['./support-android.component.css']
})
export class SupportAndroidComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy Support For Android',
      description: 'Help, support, download link and setup guides for the Cypherpunk Privacy Android app.',
      url: '/support/android'
    });
  }
}
