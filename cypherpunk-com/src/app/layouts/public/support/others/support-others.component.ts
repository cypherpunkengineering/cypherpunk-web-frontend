import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './support-others.component.html',
  styleUrls: ['./support-others.component.css']
})
export class SupportOthersComponent {

  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy Support For Embedded Devices',
      description: 'Help, support, download link and setup guides for installing Cypherpunk Privacy on embedded devices.',
      url: '/support/embedded-devices'
    })
  }
}
