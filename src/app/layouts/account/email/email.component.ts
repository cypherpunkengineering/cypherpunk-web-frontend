import { Component } from '@angular/core';

@Component({
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class ChangeEmailComponent {
  user = {
    email: 'test@example.com'
  };
}
