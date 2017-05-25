import { Location } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../../../../services/backend.service';
import { Component, PLATFORM_ID, Inject, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';

@Component({
  templateUrl: './support-article.component.html',
  styleUrls: ['./support-article.component.css']
})
export class SupportArticleComponent implements OnInit, AfterViewChecked, OnDestroy {
  pageLinks = [];
  breadcrumbs = [{ title: 'Support', link: '/support'}];
  baseRoute: String;
  contentLoaded = false;
  post = {
    id: '',
    title: '',
    labels: [],
    content: '',
    published: '',
    images: [ { url: '' } ]
  };
  currentPlatform = '';
  platforms = {
    windows: { title: 'Windows', link: '/support/windows' },
    mac: { title: 'Mac', link: '/support/macos' },
    linux: { title: 'Linux', link: '/support/linux' },
    android: { title: 'Android', link: '/support/android' },
    ios: { title: 'iOS', link: '/support/ios' },
    browsers: { title: 'Browsers', link: '/support/browsers' },
    "windows-phone": { title: 'Windows Phone', link: '/support/windows-phone' },
    routers: { title: 'Routers', link: '/support/routers' },
    other: { title: 'Other', link: '/support/other' }
  };

  CPH_REGEX = /__CYPHERPUNK_OPENVPN_HOSTNAME_SELECTOR__/g;
  CPH_COMPONENT = '<iframe src="/partial/hostname" style="width: 100%; height: 70px; border: 0; margin-top: 40px;"></iframe>';
  CPC_REGEX = /__CYPHERPUNK_PRIVACY_CREDENTIALS__/g;
  CPC_COMPONENT = '<iframe src="/partial/credentials" style="width: 100%; height: 140px; border: 0; margin-top: 20px;"></iframe>';
  CA_REGEX = /__CYPHERPUNK_OPENVPN_CA_BOX__/g;
  CA_COMPONENT = '<iframe src="/partial/cert" style="width: 100%; height: 930px; border: 0; margin-top: 40px;"></iframe>';
  CG_REGEX = /__CYPHERPUNK_OPENVPN_CONFIG_GENERATOR__/g;
  CG_COMPONENT = '<iframe src="/partial/config-generator" style="width: 100%; height: 600px; border: 0; margin-top: 20px;"></iframe>';
  GP_REGEX = /_CYPHERPUNK_GOOGLE_PLAY_BUTTON_/g;
  GP_COMPONENT = '<iframe src="/partial/google-play" style="width: 100%; height: 60px; border: 0;"></iframe>';
  AZ_REGEX = /_CYPHERPUNK_AMAZON_APP_STORE_BUTTON_/g;
  AZ_COMPONENT = '<iframe src="/partial/amazon-app-store" style="width: 100%; height: 70px; border: 0;"></iframe>';
  AP_REGEX = /_CYPHERPUNK_ITUNES_APP_STORE_BUTTON_/g;
  AP_COMPONENT = '<iframe src="/partial/itunes" style="width: 100%; height: 70px; border: 0;"></iframe>';
  CR_REGEX = /_CYPHERPUNK_CHROME_WEBSTORE_BUTTON_/g;
  CR_COMPONENT = '<iframe src="/partial/chrome" style="width: 100%; height: 70px; border: 0;"></iframe>';

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { this.baseRoute = location.path(); }

  ngOnInit() {
    // handle id in path param
    let id = this.route.snapshot.params['id'];
    if (!id) { return this.router.navigate(['/']); }
    else {
      if (isPlatformBrowser(this.platformId)) {
        this.backend.supportPost(id)
        .then((data) => {
          data.content = data.content.replace(this.CPH_REGEX, this.CPH_COMPONENT);
          data.content = data.content.replace(this.CPC_REGEX, this.CPC_COMPONENT);
          data.content = data.content.replace(this.CA_REGEX, this.CA_COMPONENT);
          data.content = data.content.replace(this.CG_REGEX, this.CG_COMPONENT);
          data.content = data.content.replace(this.GP_REGEX, this.GP_COMPONENT);
          data.content = data.content.replace(this.AZ_REGEX, this.AZ_COMPONENT);
          data.content = data.content.replace(this.AP_REGEX, this.AP_COMPONENT);
          data.content = data.content.replace(this.CR_REGEX, this.CR_COMPONENT);
          this.post = data;
          this.document.title = data.title;
        })
        .catch((err) => {
          console.log(err);
          this.router.navigate(['/support']);
        });
      }
    }

    // handle platform for breadcrumb
    let currentPlatform = this.route.snapshot.params['platform'];
    currentPlatform = currentPlatform.toLowerCase();
    if (this.platforms[currentPlatform]) {
      this.breadcrumbs.push(this.platforms[currentPlatform]);
    }
    else { this.breadcrumbs.push({ title: currentPlatform, link: '' }); }
    this.currentPlatform = currentPlatform;
  }

  ngAfterViewChecked() {
    if (this.contentLoaded) { return; }
    if (isPlatformBrowser(this.platformId)) {
      // get all h3 tags
      let elements = document.querySelectorAll('h3');
      if (elements.length) { this.contentLoaded = true; }
      for (let i = 0; i < elements.length; i++) {
        // create id hash
        let title = elements[i].textContent;
        let text = title.toLowerCase();
        text = text.trim();
        text = text.replace(/ /g, '-');
        let hash = text + '-' + i;

        // bind id to child element
        let span = document.createElement('span');
        span.id = hash;
        span.className = 'features-anchor-target';
        elements[i].appendChild(span);

        // save hash for displaying later
        setTimeout(() => {
          this.pageLinks.push({ 'title': title, hash: hash});
        });
      }
    }
  }

  ngOnDestroy() {
    this.document.title = 'Cypherpunk Privacy | Online Privacy &amp; Freedom Made Easy';
  }
}
