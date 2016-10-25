import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

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
      let body = res.json();
      console.log(body);

      this.user.plan = body.type;
      this.user.renewalDate = body.expiration;
      this.user.period = body.renewal.toUpperCase();
    });
  }
}
