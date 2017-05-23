import { Component } from '@angular/core';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-setup-credentials',
  template: `
    <div class="credentials" *ngIf="!showWarning">
      <strong>Username: </strong><br>
      <pre>{{user.privacy.username}}</pre>
      <div></div>
      <strong>Password: </strong><br>
      <pre>{{user.privacy.password}}</pre>
    </div>
    <div class="warning" *ngIf="showWarning">
      Please sign in to view this content
    </div>
  `,
  styles: ['pre { margin: 5px 0 15px; } .credentials { margin-bottom: 30px; }']
})
export class SetupCredentialsComponent {
  user: any;
  showWarning = false;

  constructor(private session: SessionService) {
    this.user = session.user;
    this.showWarning = !!this.user;
  }
}
