import { Component, Input } from '@angular/core';

@Component({
  selector: 'apps-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent {
  @Input() platform: string;
  @Input() link: string;
  @Input() ffLink: string;

  showDownloading: boolean;

  constructor() { }
}
