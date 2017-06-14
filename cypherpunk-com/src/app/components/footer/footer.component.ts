import { Component } from '@angular/core';
import { GlobalsService } from '../../services/globals.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  env: string;
  showContactForm = { show: false };

  constructor(private globals: GlobalsService) {
    this.env = globals.ENV;
  }


}
