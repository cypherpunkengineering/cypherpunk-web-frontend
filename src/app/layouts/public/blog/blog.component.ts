import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';

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

  constructor(private http: Http) { }

  ngOnInit() {
    let blogApiUrl = '/api/v0/blog/posts';
    this.http.get(blogApiUrl)
    .map(res => res.json())
    .subscribe((data: any) => {
        console.log(data);
        // shift first item to be featured
      },
      (error: any) => { console.log(error); }
    );
  }

  truncateContent () {

  }

}
