import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute,
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.backend.supportPost(id)
    .subscribe(
      (data: any) => {
        this.post = data;
        this.document.title = data.title;
      },
      (error: any) => { console.log(error); }
    );
  }

  postDate() {
    if (this.post.published === '{{__BLOG_DATE__}}') {
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
