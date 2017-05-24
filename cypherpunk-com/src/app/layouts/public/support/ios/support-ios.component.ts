import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';

@Component({
  templateUrl: './support-ios.component.html',
  styleUrls: ['./support-ios.component.css']
})
export class SupportIOSComponent {

  constructor(
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Cypherpunk Privacy Support'; }
}
