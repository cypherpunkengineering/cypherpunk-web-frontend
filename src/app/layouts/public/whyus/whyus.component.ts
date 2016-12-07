import { Component, AfterViewInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './whyus.component.html',
  styleUrls: ['./whyus.component.scss']
})
export class WhyusComponent implements AfterViewInit {
  title: string = 'Why You Need Cypherpunk Privacy';
  description: string = 'Cypherpunk Privacy provides unrestricted access to the internet, protects your privacy online and secures public WiFi networks.';

  constructor(@Inject(DOCUMENT) private document: any) { }

  ngAfterViewInit(): void { this.document.title = this.title; }
}
