import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class LocationsResolver implements Resolve<any> {
  constructor(private http: Http) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let locationsUrl = '/api/v0/location/list/premium';
    let regionsUrl = '/api/v0/location/world';

    let locationsObs = this.http.get(locationsUrl).map(res => res.json());
    let regionsObs = this.http.get(regionsUrl).map(res => res.json());


    return Observable.forkJoin([locationsObs, regionsObs])
    .catch((error: Response | any) => {
      console.error(error);
      return Observable.throw('Could not load Server Location Information');
    });
  }
}
