import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { BlogPostComponent } from './blog-post.component';
import { BlogPostRoutingModule } from './blog-post-routing.module';

@NgModule({
  imports: [
    SharedModule,
    BlogPostRoutingModule
  ],
  declarations: [
    BlogPostComponent
  ]
})
export class BlogPostModule { }
