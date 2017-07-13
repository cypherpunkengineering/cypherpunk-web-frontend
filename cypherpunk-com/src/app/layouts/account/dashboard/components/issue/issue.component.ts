import { Component } from '@angular/core';
import { BackendService } from '../../../../../services/backend.service';

@Component({
  selector: 'account-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class AccountIssueComponent {
  display = { show: true };

  constructor(private backend: BackendService) {}
}
