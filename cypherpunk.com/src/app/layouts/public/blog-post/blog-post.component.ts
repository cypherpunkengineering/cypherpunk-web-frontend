import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';

@Component({
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit {
  post = {
    id: 'postId1',
    title: 'Hello World!',
    content: 'some content',
    published: '2016-12-24T17:07:00+09:00',
    images: [
      { url: 'http://placehold.it/250x150' }
    ]
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

}
