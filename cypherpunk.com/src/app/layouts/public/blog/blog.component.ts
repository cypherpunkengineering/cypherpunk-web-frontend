import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';

@Component({
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  featured;
  posts = [];
  showSearch: boolean = false;

  constructor(private backend: BackendService) { }

  ngOnInit() {
    this.backend.blogPosts()
    .subscribe((data: any) => {
        // shift first item to be featured
        if (data.items.length) {
          this.featured = data.items.shift();
          this.posts = data.items;
        }
      },
      (error: any) => { console.log(error); }
    );
  }

}
