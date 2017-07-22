import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { BackendService } from '../../../services/backend.service';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

@Component({
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit, OnDestroy {
  post = {
    id: '',
    title: '',
    content: '',
    published: '',
    images: [ { url: '' } ]
  };

  img: any;
  ctaImages = [
    {
      url: '/assets/blog/cta-button-01@2x.png',
      srcset: '/assets/blog/cta-button-01.png 500w, /assets/blog/cta-button-01@2x.png 1000w',
      token: '123'
    },
    {
      url: '/assets/blog/cta-button-02@2x.png',
      srcset: '/assets/blog/cta-button-02.png 500w, /assets/blog/cta-button-02@2x.png 1000w',
      token: '456'
    },
    {
      url: '/assets/blog/cta-button-03@2x.png',
      srcset: '/assets/blog/cta-button-03.png 500w, /assets/blog/cta-button-03@2x.png 1000w',
      token: '789'
    }
  ];

  showSearch: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) { this.img = this.ctaImages[Math.floor(Math.random() * this.ctaImages.length)]; }

  ngOnInit() {
    let postId = this.route.snapshot.params['postId'];
    this.backend.blogPost(postId)
    .subscribe(
      (data: any) => {
        this.post = data;
        this.post.content = this.post.content.replace(/CypherpunkDescription: .*/, '');
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
