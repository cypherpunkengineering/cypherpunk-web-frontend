import { Component } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './inquiries.component.html',
  styleUrls: ['./inquiries.component.css']
})
export class InquiriesComponent {
  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'About Cypherpunk Privacy',
      description: 'If you are a member of the media and would like to talk or test our product, please use the information on this page to contact us.',
      url: '/about/inquiries'
    });
  }
}
