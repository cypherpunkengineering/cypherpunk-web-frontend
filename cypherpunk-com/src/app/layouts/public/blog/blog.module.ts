import { NgModule } from '@angular/core';

import { SharedModule } from '../../../components/shared/shared.module';
import { BlogComponent } from './blog.component';
import { BlogRoutingModule } from './blog-routing.module';

@NgModule({
  imports: [
    SharedModule,
    BlogRoutingModule
  ],
  declarations: [
    BlogComponent
  ]
})
export class BlogModule { }
