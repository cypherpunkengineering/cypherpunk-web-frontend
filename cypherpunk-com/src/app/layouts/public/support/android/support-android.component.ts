import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';

@Component({
  templateUrl: './support-android.component.html',
  styleUrls: ['./support-android.component.css']
})
export class SupportAndroidComponent {

  constructor(
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Cypherpunk Privacy Support'; }
}
