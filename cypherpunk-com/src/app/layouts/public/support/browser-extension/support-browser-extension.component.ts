import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';

@Component({
  templateUrl: './support-browser-extension.component.html',
  styleUrls: ['./support-browser-extension.component.css']
})
export class SupportBrowserExtensionComponent {

  constructor(
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Cypherpunk Privacy Support'; }
}
