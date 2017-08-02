import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './support-windows.component.html',
  styleUrls: ['./support-windows.component.css']
})
export class SupportWindowsComponent {

  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy Support For Windows',
      description: 'Help, support, download link and setup guides for the Cypherpunk Privacy Windows app.',
      url: '/support/windows'
    });
  }
}
