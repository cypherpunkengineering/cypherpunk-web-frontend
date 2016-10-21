import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {
  user = {
    username: '',
    email: '',
    priceModel: 0,
    payOption: 0
  };
}
