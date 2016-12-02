import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class LocationsResolver implements Resolve<any> {
  constructor(private http: Http) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let url = '/api/v0/location/list/premium';
    return this.http.get(url)
    .map((res: Response) => {
      let data = res.json();
      return data || {};
    })
    .catch((error: Response | any) => {
      console.error(error);
      return Observable.throw('Could not load Server Location Information');
    });
  }
}
