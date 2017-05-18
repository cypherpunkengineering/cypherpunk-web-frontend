import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';

@Component({
  templateUrl: './support-linux.component.html',
  styleUrls: ['./support-linux.component.css']
})
export class SupportLinuxComponent {

  constructor(
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Cypherpunk Privacy Support'; }
}
