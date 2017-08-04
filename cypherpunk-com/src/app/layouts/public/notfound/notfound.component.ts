import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

@Component({
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotFoundComponent {
  constructor(private seo: SeoService, private route: ActivatedRoute) {
    let template = this.route.snapshot.queryParamMap['params']['template'];
    let meta = {
      title: 'Page Not Found | Cypherpunk Privacy',
      description: '404 Error: This page does not exist.',
      url: '/404'
    };
    if (template === 'true') {
      meta.title = '{{__404_TITLE__}}';
      meta.description = '{{__404_DESCRIPTION__}}';
      meta.url = '{{__404_URL__}}';
      meta['image'] = '{{__404_IMAGE__}}';
    }

    seo.updateMeta(meta);
  }
}
