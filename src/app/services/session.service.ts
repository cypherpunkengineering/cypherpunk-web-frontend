import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {
  user = {
    username: '',
    email: ''
  };

  getUser() { return this.user; }
  setUser(user) {
    this.user.username = user.username;
    this.user.email = user.email;
  }
}
