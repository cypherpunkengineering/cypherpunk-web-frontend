import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SupportArticleComponent } from './support-article.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'support/:platform/:id', component: SupportArticleComponent },
      { path: 'support/:platform/:id/:text', component: SupportArticleComponent },
    ])
  ]
})
export class SupportArticleRoutingModule { }
