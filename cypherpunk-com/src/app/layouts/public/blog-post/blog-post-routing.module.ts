import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BlogPostComponent } from './blog-post.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'blog/post/:postId', component: BlogPostComponent }
    ])
  ]
})
export class BlogPostRoutingModule { }
