import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {
  user = {
    username: '',
    email: 'test@example.com',
    status: 'active',
    plan: 'free',
    period: '6 months',
    renewalDate: '2017-03-03T03:24:00',
    priceModel: 0,
    payOption: 0
  };
}
