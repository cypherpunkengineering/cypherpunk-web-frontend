import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Manual VPN & Online Privacy App',
      description: 'Protect all your devices with the Cypherpunk VPN & Online Privacy App.',
      url: '/apps/manual'
    })
  }
}
