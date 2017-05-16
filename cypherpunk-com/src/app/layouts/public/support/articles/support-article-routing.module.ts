import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SupportArticleComponent } from './support-article.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'support/articles/:id', component: SupportArticleComponent },
      { path: 'support/tutorials/:id', component: SupportArticleComponent },
      { path: 'support/articles/:id/:text', component: SupportArticleComponent },
      { path: 'support/tutorials/:id/:text', component: SupportArticleComponent }
    ])
  ]
})
export class SupportArticleRoutingModule { }
