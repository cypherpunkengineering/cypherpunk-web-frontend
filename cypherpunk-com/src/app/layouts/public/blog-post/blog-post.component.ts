import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
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

  showSearch: boolean = false;

  constructor(private backend: BackendService, private route: ActivatedRoute) { }

  ngOnInit() {
    let postId = this.route.snapshot.params['postId'];
    this.backend.blogPost(postId)
    .subscribe(
      (data: any) => { this.post = data; },
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
