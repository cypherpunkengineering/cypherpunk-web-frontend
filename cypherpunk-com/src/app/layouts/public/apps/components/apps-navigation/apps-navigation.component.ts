import { Component, Input } from '@angular/core';

@Component({
  selector: 'apps-navigation',
  templateUrl: './apps-navigation.component.html',
  styleUrls: ['./apps-navigation.component.css']
})
export class AppsNavigationComponent {
  @Input() page: string;

  constructor() { }
}
