import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  showFeedbackModal: boolean = false;
  showSupportModal: boolean = false;

  openFeedbackModal() {
    let ze = (<any>window).zE;
    ze.activate({hideOnClose: true});
  }

  openSupportModal() {
    let ze = (<any>window).zE;
    ze.activate({hideOnClose: true});
  }
}
