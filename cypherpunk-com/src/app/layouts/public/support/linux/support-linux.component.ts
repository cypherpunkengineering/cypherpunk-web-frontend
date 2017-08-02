import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './support-linux.component.html',
  styleUrls: ['./support-linux.component.css']
})
export class SupportLinuxComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy Support For Linux',
      description: 'Help, support, download link and setup guides for the Cypherpunk Privacy Linux app.',
      url: '/support/linux'
    });
  }
}
