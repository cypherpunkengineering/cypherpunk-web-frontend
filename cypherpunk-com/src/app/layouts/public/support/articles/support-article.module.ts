import { NgModule } from '@angular/core';
import { SupportArticleComponent } from './support-article.component';
import { SharedModule } from '../../../../components/shared/shared.module';
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
