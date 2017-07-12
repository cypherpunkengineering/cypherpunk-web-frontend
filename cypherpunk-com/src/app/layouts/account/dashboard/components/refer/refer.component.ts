import { Component } from '@angular/core';
import { BackendService } from '../../../../../services/backend.service';

@Component({
  selector: 'account-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.css']
})
export class AccountReferComponent {
  invitee = { name: '', email: '' };
  showInvitationSent = false;

  constructor(private backend: BackendService) {}

  invite() {
    this.backend.invite(this.invitee, {})
    .then((data) => {
      this.showInvitationSent = true;
      setTimeout(() => { this.showInvitationSent = false; }, 5000);
    });
  }

  copy() {
    let el = (document.getElementById('cp-share')) as HTMLInputElement;

    try {
      el.select();
      document.execCommand('copy');
      el.blur();
    }
    catch (err) {
      alert('Please press Ctrl/Cmd + C to copy');
    }
  }
}
