import { Location } from '@angular/common';
import { isBrowser } from 'angular2-universal';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../../../../services/backend.service';
import { Component, Inject, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';

@Component({
  templateUrl: './support-article.component.html',
  styleUrls: ['./support-article.component.css']
})
export class SupportArticleComponent implements OnInit, AfterViewChecked, OnDestroy {
  contentLoaded: boolean = false;
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

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.baseRoute = location.path();
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    if (!id) { return this.router.navigate(['/']); }
    else {
      this.backend.supportPost(id)
      .then((data) => {
        this.post = data;
        this.document.title = data.title;
      })
      .catch((err) => {
        this.router.navigate(['/support']);
      });
    }
  }

  ngAfterViewChecked() {
    if (this.contentLoaded) { return; }
    if (isBrowser) {
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
