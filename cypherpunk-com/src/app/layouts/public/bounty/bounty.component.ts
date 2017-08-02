import { Component } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  templateUrl: './bounty.component.html',
  styleUrls: ['./bounty.component.css']
})
export class BountyComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Bug Bounty Program by Cypherpunk Privacy',
      description: 'Earn money by ethically disclosing legitimate vulnerabilities to our website and apps.',
      url: '/bounty'
    });
  }
}
