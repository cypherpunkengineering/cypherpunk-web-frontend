import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './routers.component.html',
  styleUrls: ['./routers.component.css']
})
export class RoutersComponent {
  switch1: boolean = true;
  switch2: boolean = true;

  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Download Router Privacy & VPN Apps';
  }
}
