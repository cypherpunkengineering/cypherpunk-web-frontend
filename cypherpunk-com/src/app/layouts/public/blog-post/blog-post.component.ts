import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Component, Inject, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { BackendService } from '../../../services/backend.service';

@Component({
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit {
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

  showSearch = false;

  constructor(
    private title: Title,
    private seo: SeoService,
    private route: ActivatedRoute,
    private backend: BackendService
  ) {
    this.img = this.ctaImages[Math.floor(Math.random() * this.ctaImages.length)];
    seo.updateMeta({
      title: '{{__BLOG_TITLE__}}',
      description: '{{__BLOG_DESCRIPTION__}}',
      url: '{{__BLOG_URL__}}',
      image: '{{__BLOG_IMAGE__}}'
    });
  }

  ngOnInit() {
    let postId = this.route.snapshot.params['postId'];
    this.backend.blogPost(postId)
    .subscribe(
      (data: any) => {
        this.post = data;
        this.post.content = this.post.content.replace(/CypherpunkDescription: .*/, '');
        this.title.setTitle(data.title);
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
}
