import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  openSupportModal() {
    let ze = (<any>window).zE;
    ze.activate({hideOnClose: true});
  }
}
