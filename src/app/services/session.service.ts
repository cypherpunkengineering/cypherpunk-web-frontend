import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';

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
    payOption: 0,
    secret: ''
  };

  constructor(private http: Http) {}

  pullSessionData() {
    let url = '/api/subscription/status';
    return this.http.get(url).toPromise()
    .then(function(res: Response) {
      console.log(res);
    });
  }
}
