import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';

@Component({
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  posts = [];
  showSearch = false;

  constructor(
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Cypherpunk Online Privacy & Freedom Blog'; }

  ngOnInit() {
    this.backend.blogPosts()
    .subscribe((data: any) => {
        // shift first item to be featured
        if (data.items && data.items.length) {
          this.posts = data.items;
        }
      },
      (error: any) => { console.log(error); }
    );
  }

}
