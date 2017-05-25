import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject, OnInit } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';

@Component({
  templateUrl: './support-home.component.html',
  styleUrls: ['./support-home.component.css']
})
export class SupportHomeComponent implements OnInit {
  posts = [];

  constructor(
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Cypherpunk Privacy Support'; }

  ngOnInit() {
    this.backend.supportPosts()
    .then((data) => {
      if (data.items && data.items.length) {
        this.posts = data.items;
      }
    })
    .catch((err) => { console.log(err); });
  }
}
