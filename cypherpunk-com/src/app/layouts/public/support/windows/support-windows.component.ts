import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject } from '@angular/core';
import { BackendService } from '../../../../services/backend.service';

@Component({
  templateUrl: './support-windows.component.html',
  styleUrls: ['./support-windows.component.css']
})
export class SupportWindowsComponent {

  constructor(
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Cypherpunk Online Privacy & Freedom Support Blog'; }
}
