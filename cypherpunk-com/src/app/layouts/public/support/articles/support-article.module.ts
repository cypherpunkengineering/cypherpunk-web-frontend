import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportArticleComponent } from './support-article.component';
import { SupportArticleRoutingModule } from './support-article-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportArticleRoutingModule
  ],
  declarations: [
    SupportArticleComponent
  ]
})
export class SupportArticleModule { }
