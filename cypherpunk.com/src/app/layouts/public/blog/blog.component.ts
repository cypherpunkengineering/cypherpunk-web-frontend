import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';

@Component({
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  posts = [
    {
      id: 'postId1',
      title: 'Hello World!',
      content: 'some content',
      published: '2016-12-24T17:07:00+09:00',
      images: [
        { url: 'http://placehold.it/250x150' }
      ]
    },
    {
      id: 'postId1',
      title: 'Hello World!',
      content: 'some content',
      published: '2016-12-24T17:07:00+09:00',
      images: [
        { url: 'http://placehold.it/250x150' }
      ]
    },
    {
      id: 'postId1',
      title: 'Hello World!',
      content: 'some content',
      published: '2016-12-24T17:07:00+09:00',
      images: [
        { url: 'http://placehold.it/250x150' }
      ]
    },
    {
      id: 'postId1',
      title: 'Hello World!',
      content: 'some content',
      published: '2016-12-24T17:07:00+09:00',
      images: [
        { url: 'http://placehold.it/250x150' }
      ]
    },
    {
      id: 'postId1',
      title: 'Hello World!',
      content: 'some content',
      published: '2016-12-24T17:07:00+09:00',
      images: [
        { url: 'http://placehold.it/250x150' }
      ]
    },
    {
      id: 'postId1',
      title: 'Hello World!',
      content: 'some content',
      published: '2016-12-24T17:07:00+09:00',
      images: [
        { url: 'http://placehold.it/250x150' }
      ]
    },
    {
      id: 'postId1',
      title: 'Hello World!',
      content: 'some content',
      published: '2016-12-24T17:07:00+09:00',
      images: [
        { url: 'http://placehold.it/250x150' }
      ]
    },
    {
      id: 'postId1',
      title: 'Hello World!',
      content: 'some content',
      published: '2016-12-24T17:07:00+09:00',
      images: [
        { url: 'http://placehold.it/250x150' }
      ]
    },
    {
      id: 'postId1',
      title: 'Hello World!',
      content: 'some content',
      published: '2016-12-24T17:07:00+09:00',
      images: [
        { url: 'http://placehold.it/250x150' }
      ]
    },
    {
      id: 'postId1',
      title: 'Hello World!',
      content: 'some content',
      published: '2016-12-24T17:07:00+09:00',
      images: [
        { url: 'http://placehold.it/250x150' }
      ]
    },
    {
      id: 'postId1',
      title: 'Hello World!',
      content: 'some content',
      published: '2016-12-24T17:07:00+09:00',
      images: [
        { url: 'http://placehold.it/250x150' }
      ]
    }
  ];
  showSearch: boolean = false;

  featured = {
    id: 'postId1',
    title: 'Hello World!',
    content: 'some content',
    published: '2016-12-24T17:07:00+09:00',
    images: [
      { url: 'http://placehold.it/250x150' }
    ]
  };

  constructor(private backend: BackendService) { }

  ngOnInit() {
    this.backend.blogPosts()
    .subscribe((data: any) => {
        console.log(data);
        // shift first item to be featured
        this.featured = data.items.shift();
        this.posts = data.items;
      },
      (error: any) => { console.log(error); }
    );
  }

}
