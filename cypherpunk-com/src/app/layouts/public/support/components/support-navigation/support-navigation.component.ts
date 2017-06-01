import { Component, Input } from '@angular/core';

@Component({
  selector: 'support-navigation',
  templateUrl: './support-navigation.component.html',
  styleUrls: ['./support-navigation.component.css']
})
export class SupportNavigationComponent {
  @Input() page: string;

  constructor() { }
}
