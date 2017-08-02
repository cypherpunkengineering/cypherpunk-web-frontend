import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { BackendService } from '../../../services/backend.service';

@Component({
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  posts = [];
  showSearch = false;

  constructor(
    private seo: SeoService,
    private backend: BackendService
  ) {
    seo.updateMeta({
      title: 'Cypherpunk Online Privacy & Freedom Blog',
      description: 'Online privacy and freedom blog by Cypherpunk Privacy.',
      url: '/blog'
    });
  }

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
