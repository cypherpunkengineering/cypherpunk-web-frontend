import { Component } from '@angular/core';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-setup-credentials',
  template: `
    <strong>Username: </strong><br>
    <pre>{{user.privacy.username}}</pre>
    <div></div>
    <strong>Password: </strong><br>
    <pre>{{user.privacy.password}}</pre>
  `
})
export class SetupCredentialsComponent {
  user: any;

  constructor(private session: SessionService) { this.user = session.user; }
}
