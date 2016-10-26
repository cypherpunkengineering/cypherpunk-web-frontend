import { Component } from '@angular/core';
import { SessionService } from '../../../services/session.service';

@Component({
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class ChangeEmailComponent {
  user = { email: '' };

  constructor(private session: SessionService) {
    this.user.email = session.user.email;
  }
}
