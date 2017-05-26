import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DownloadComponent } from './download.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'download',
        children: [
          { path: '', component: DownloadComponent },
          { path: 'windows', pathMatch: 'full', redirectTo: '/apps/windows/autostart' },
          { path: 'mac', pathMatch: 'full', redirectTo: '/apps/mac/autostart' },
          { path: 'macos', pathMatch: 'full', redirectTo: '/apps/macos/autostart' },
          { path: 'linux', pathMatch: 'full', redirectTo: '/apps/linux/autostart' },
          { path: 'android', pathMatch: 'full', redirectTo: '/apps/android/autostart' },
          { path: 'ios', pathMatch: 'full', redirectTo: '/apps/ios/autostart' },
          { path: 'browser', pathMatch: 'full', redirectTo: '/apps/browser/autostart' },
          { path: 'routers', pathMatch: 'full', redirectTo: '/apps/routers/autostart' },
          { path: '**', redirectTo: '/apps' }
        ]
      },
    ])
  ]
})
export class DownloadRoutingModule { }
