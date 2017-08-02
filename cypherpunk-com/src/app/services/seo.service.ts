import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable()
export class SeoService {
  title: string;
  desc: string;
  url: string;
  image: string;

  constructor(private titleService: Title, private metaService: Meta) {
    this.title = 'Cypherpunk Privacy Apps & VPN Service';
    this.desc = 'Protect your online privacy and freedom with easy to use apps for every device.';
    this.desc += '   Try it free for 7 days!  24/7/365 customer support.';
    this.url = 'https://cypherpunk.com';
    this.image = 'https://cypherpunk.com/assets/landing/landing@2x.png';
  }

  updateMeta(data?) {
    // setup seo data
    data = data || {};
    let title = data.title || this.title;
    let desc = data.description || this.desc;
    let url = this.url + (data.url || '');
    let image = data.image || this.image;

    // update title
    this.titleService.setTitle(title);
    // update description
    this.metaService.updateTag({ content: desc }, `name='description'`);
    // update facebook tags
    this.metaService.updateTag({ content: title }, `property='og:title'`);
    this.metaService.updateTag({ content: desc }, `property='og:description'`);
    this.metaService.updateTag({ content: url }, `property='og:url'`);
    this.metaService.updateTag({ content: image }, `property='og:image'`);
    // update twitter tags
    this.metaService.updateTag({ value: title }, `name='twitter:title'`);
    this.metaService.updateTag({ value: desc }, `name='twitter:description'`);
    this.metaService.updateTag({ value: url }, `name='twitter:url'`);
    this.metaService.updateTag({ content: image }, `name='twitter:image'`);
  }
}
