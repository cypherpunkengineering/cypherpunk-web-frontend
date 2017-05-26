import { Component, Input } from '@angular/core';

@Component({
  selector: 'apps-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent {
  @Input() platform: string;

  constructor() { }

  downloadLink() {
    return `/download/${this.platform}/autostart`;
  }
}
