import { Component } from '@angular/core';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-setup-credentials',
  template: `
    <div class="credentials">
      <strong>Username: </strong><br>
      <pre>{{user.privacy.username}}</pre>
      <div></div>
      <strong>Password: </strong><br>
      <pre>{{user.privacy.password}}</pre>
    </div>
  `,
  styles: ['pre { margin: 5px 0 15px; } .credentials { margin-bottom: 30px; }']
})
export class SetupCredentialsComponent {
  user: any;

  constructor(private session: SessionService) { this.user = session.user; }
}
