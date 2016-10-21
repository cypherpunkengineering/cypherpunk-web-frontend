import { Injectable } from '@angular/core';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  authed: boolean = false;
  redirectUrl: string;

  constructor(private session: SessionService) {}

  login(user) {
    this.authed = true;
    return Promise.resolve(this.authed);
  }

  logout() { this.authed = false; }
}
