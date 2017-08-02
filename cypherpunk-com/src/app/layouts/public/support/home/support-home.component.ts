import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './support-home.component.html',
  styleUrls: ['./support-home.component.css']
})
export class SupportHomeComponent {
  switches = {
    'privacy-security': { show: false },
    'account-billing': { show: false },
    'cypherpunk-privacy-features': { show: false },
    'desktop-features': { show: false },
    'android-features': { show: false },
    'ios-features': { show: false },
    'browser-extension-features': { show: false },
    'streaming-services-cypherplay': { show: false }
  }

  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy Support',
      description: 'Get help and support for Cypherpunk Privacy apps and service, 24/7/365.',
      url: '/support'
    });
  }

  showSection(id) {
    this.switches[id].show = !this.switches[id].show;
    let el = document.getElementById(id);
    if (this.switches[id].show) {
      el.style['max-height'] = el.scrollHeight + 'px';
      el.style['opacity'] = '1';
    }
    else {
      el.style['max-height'] = '0';
      el.style['opacity'] = '0';
    }
  }

  toggle(id) {
    let el = document.getElementById(id);
    if (!el) { return; }
    el.classList.toggle('closed');
  }
}
