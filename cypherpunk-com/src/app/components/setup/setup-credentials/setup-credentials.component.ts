import { Component } from '@angular/core';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-setup-credentials',
  templateUrl: 'setup-credentials.component.html',
  styleUrls: ['setup-credentials.component.css']
})
export class SetupCredentialsComponent {
  user: any;
  showWarning = false;

  constructor(private session: SessionService) {
    this.user = session.user;
    this.showWarning = !!!this.user.privacy.username;
  }

  copy(element: string) {
    let el = (document.getElementById(element)) as HTMLInputElement;

    try {
      el.select();
      document.execCommand('copy');
      el.blur();
    }
    catch(err) {
      alert('Please press Ctrl/Cmd + C to copy');
    }
  }
}
