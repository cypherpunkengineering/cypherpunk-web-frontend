import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportArticleComponent } from './support-article.component';
import { SupportArticleRoutingModule } from './support-article-routing.module';

@NgModule({
  imports: [
    SupportSharedModule,
    SupportArticleRoutingModule
  ],
  declarations: [
    SupportArticleComponent
  ]
})
export class SupportArticleModule { }
