import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { BackendService } from '../../../../services/backend.service';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

@Component({
  templateUrl: './support-article.component.html',
  styleUrls: ['./support-article.component.css']
})
export class SupportArticleComponent implements OnInit, OnDestroy {
  post = {
    id: '',
    title: '',
    content: '',
    published: '',
    images: [ { url: '' } ]
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) { }

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

  postDate() {
    if (!this.post) { return; }
    if (this.post.published === '{{__SUPPORT_DATE__}}') {
      return this.post.published;
    }
    else if (!this.post.published) {
      return this.post.published;
    }
    else {
      let datePipe = new DatePipe('en-us');
      return datePipe.transform(this.post.published, 'MM/dd/yyyy');
    }
  }

  ngOnDestroy() {
    this.document.title = 'Cypherpunk Privacy | Online Privacy &amp; Freedom Made Easy';
  }

}
