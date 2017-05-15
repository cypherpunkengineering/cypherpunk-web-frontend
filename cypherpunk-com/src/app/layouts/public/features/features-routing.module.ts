import { NgModule, Component } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

import { FeaturesComponent } from './features.component';

@Component({
  template: ''
})
export class RedirectComponent {
  constructor (private router: Router, private route: ActivatedRoute) {
    let fragment = this.route.snapshot.data['fragment'];
    this.router.navigate(['/features'], { fragment: fragment });
  }
}

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'features', component: FeaturesComponent }
      // {
      //   path: 'freedom',
      //   component: RedirectComponent,
      //   data: { fragment: 'freedom' },
      //   pathMatch: 'full'
      // },
      // {
      //   path: 'privacy',
      //   component: RedirectComponent,
      //   data: { fragment: 'privacy' },
      //   pathMatch: 'full'
      // },
      // {
      //   path: 'security',
      //   component: RedirectComponent,
      //   data: { fragment: 'security' },
      //   pathMatch: 'full'
      // },
      // {
      //   path: 'support',
      //   component: RedirectComponent,
      //   data: { fragment: 'support' },
      //   pathMatch: 'full'
      // }
    ])
  ]
})
export class FeaturesRoutingModule { }
