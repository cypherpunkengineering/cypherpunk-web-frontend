import { Component, AfterViewInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './howitworks.component.html',
  styleUrls: ['./howitworks.component.css']
})
export class HowitworksComponent implements AfterViewInit {
  title: string = 'How Cypherpunk Privacy Protects Your Online Privacy and Freedom';
  description: string = 'Learn how Cypherpunk Privacy provides unrestricted access to the internet and protects your privacy online.';

  constructor(@Inject(DOCUMENT) private document: any) { }

  ngAfterViewInit(): void { this.document.title = this.title; }
}
