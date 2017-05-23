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
  contentLoaded = false;
  pageLinks = [];
  baseRoute: String;
  post = {
    id: '',
    title: '',
    labels: [],
    content: '',
    published: '',
    images: [ { url: '' } ]
  };

  CPH_REGEX = /__CYPHERPUNK_OPENVPN_HOSTNAME_SELECTOR__/g;
  CPH_COMPONENT = '<iframe src="/partial/hostname" style="width: 100%; height: 70px; border: 0; margin-top: 40px;"></iframe>';
  CPC_REGEX = /__CYPHERPUNK_PRIVACY_CREDENTIALS__/g;
  CPC_COMPONENT = '<iframe src="/partial/credentials" style="width: 100%; height: 130px; border: 0; margin-top: 40px;"></iframe>';

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.baseRoute = location.path();
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    if (!id) { return this.router.navigate(['/']); }
    else {
      if (isPlatformBrowser(this.platformId)) {
        console.log('in browser');
        this.backend.supportPost(id)
        .then((data) => {
          data.content = data.content.replace(this.CPH_REGEX, this.CPH_COMPONENT);
          data.content = data.content.replace(this.CPC_REGEX, this.CPC_COMPONENT);
          this.post = data;
          this.document.title = data.title;
        })
        .catch((err) => {
          console.log(err);
          this.router.navigate(['/support']);
        });
      }
    }
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
