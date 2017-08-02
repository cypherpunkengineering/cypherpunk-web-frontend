import { Component } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  templateUrl: './whyus.component.html',
  styleUrls: ['./whyus.component.css']
})
export class WhyusComponent {
  constructor(private seo: SeoService) {
    let desc = 'Discover how Cypherpunk Privacy protects your online privacy and freedom and secures public Wi-Fi networks.'
    seo.updateMeta({
      title: 'Why You Need Cypherpunk Privacy & VPN Service',
      description: desc + ' Try it free for a limited time only!',
      url: '/why-use-a-vpn'
    });
  }
}
