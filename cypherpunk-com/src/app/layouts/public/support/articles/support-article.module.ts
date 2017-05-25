import { NgModule } from '@angular/core';
import { SupportSharedModule } from '../support-shared.module';
import { SupportArticleComponent } from './support-article.component';
import { SharedModule } from '../../../../components/shared/shared.module';
import { SupportArticleRoutingModule } from './support-article-routing.module';

@NgModule({
  imports: [
    SharedModule,
    SupportSharedModule,
    SupportArticleRoutingModule
  ],
  declarations: [
    SupportArticleComponent
  ]
})
export class SupportArticleModule { }
