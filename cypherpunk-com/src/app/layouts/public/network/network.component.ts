import { Observable } from 'rxjs/Rx';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import 'rxjs/add/observable/forkJoin';

@Component({
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent implements OnInit {
  regionArray = [];
  locationArray = [];
  loading: boolean = true;
  totalServers: number = 0;

  // Map Stuff
  pi = Math.PI;
  halfPi = this.pi / 2;
  epsilon = Number.EPSILON;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.document.title = 'Cypherpunk Privacy VPN Network';
  }

  ngOnInit() {
    // let locationsObs = this.backend.locations();
    // let regionsObs = this.backend.regions();
    //
    // return Observable.forkJoin([locationsObs, regionsObs])
    // .subscribe((data: any) => {
    //     // parse data
    //     let locations = data[0];
    //     let regions = data[1];
    //
    //     // create regionsArray
    //     regions.regionOrder.forEach((regionId) => {
    //       if (regionId !== 'DEV') {
    //         this.regionArray.push({
    //           id: regionId,
    //           name: regions.region[regionId],
    //           countries: []
    //         });
    //       }
    //     });
    //
    //     // drop each location into their region
    //     let locArray = Object.keys(locations);
    //     locArray.forEach((key) => {
    //       let location = locations[key];
    //       this.totalServers += location.servers;
    //       let region = this.findRegion(location.region);
    //       region.countries.push(location);
    //     });
    //
    //     // sort each region's countries
    //     this.regionArray.forEach((region) => {
    //       region.countries.sort(this.regionSort);
    //     });
    //
    //     this.regionArray.forEach((region) => {
    //       region.countries.forEach((location) => {
    //         this.locationArray.push(location);
    //       });
    //     });
    //
    //     this.translateLocations(this.locationArray);
    //
    //     console.log(JSON.stringify(this.locationArray));
    //
    //     this.loading = false;
    //   },
    //   (error: any) => {
    //     this.loading = false;
    //     console.log(error);
    //   }
    // );

    this.locationArray = JSON.parse(`[{"id":"montreal","region":"NA","country":"CA","lat":45.5017,"lon":-73.5673,"scale":1,"name":"Canada - Montreal","nameFull":"Canada - Montreal","level":"free","servers":2,"ovHostname":"montreal.cypherpunk.privacy.network","ovDefault":["169.54.90.16"],"ovNone":["169.54.90.16"],"ovStrong":["169.54.90.16"],"ovStealth":["169.54.90.17"],"ipsecHostname":"montreal.cypherpunk.privacy.network","ipsecDefault":["169.54.90.16"],"httpDefault":["169.54.90.16"],"socksDefault":["169.54.90.16"],"enabled":true,"authorized":true},{"id":"toronto","region":"NA","country":"CA","lat":43.6532,"lon":-79.3832,"scale":1,"name":"Canada - Toronto","nameFull":"Canada - Toronto","level":"free","servers":2,"ovHostname":"toronto.cypherpunk.privacy.network","ovDefault":["209.95.57.40"],"ovNone":["209.95.57.40"],"ovStrong":["209.95.57.40"],"ovStealth":["209.95.57.41"],"ipsecHostname":"toronto.cypherpunk.privacy.network","ipsecDefault":["209.95.57.40"],"httpDefault":["209.95.57.40"],"socksDefault":["209.95.57.40"],"enabled":true,"authorized":true},{"id":"vancouver","region":"NA","country":"CA","lat":49.2827,"lon":-123.1207,"scale":1,"name":"Canada - Vancouver","nameFull":"Canada - Vancouver","level":"free","servers":3,"ovHostname":"vancouver.cypherpunk.privacy.network","ovDefault":["107.181.189.211"],"ovNone":["107.181.189.211"],"ovStrong":["107.181.189.211"],"ovStealth":["107.181.189.212"],"ipsecHostname":"vancouver.cypherpunk.privacy.network","ipsecDefault":["107.181.189.211"],"httpDefault":["107.181.189.211"],"socksDefault":["107.181.189.211"],"enabled":true,"authorized":true},{"id":"atlanta","region":"NA","country":"US","lat":33.749,"lon":-84.388,"scale":1,"name":"US - Atlanta, GA","nameFull":"US - Atlanta, GA","level":"free","servers":3,"ovHostname":"atlanta.cypherpunk.privacy.network","ovDefault":["66.71.252.3"],"ovNone":["66.71.252.3"],"ovStrong":["66.71.252.3"],"ovStealth":["66.71.252.4"],"ipsecHostname":"atlanta.cypherpunk.privacy.network","ipsecDefault":["66.71.252.3"],"httpDefault":["66.71.252.3"],"socksDefault":["66.71.252.3"],"enabled":true,"authorized":true},{"id":"chicago","region":"NA","country":"US","lat":41.8781,"lon":-87.6298,"scale":1,"name":"US - Chicago, IL","nameFull":"US - Chicago, IL","level":"free","servers":3,"ovHostname":"chicago.cypherpunk.privacy.network","ovDefault":["104.200.153.226","184.170.250.91"],"ovNone":["104.200.153.226","184.170.250.91"],"ovStrong":["104.200.153.226","184.170.250.91"],"ovStealth":["104.200.153.229","184.170.250.92"],"ipsecHostname":"chicago.cypherpunk.privacy.network","ipsecDefault":["104.200.153.226","184.170.250.91"],"httpDefault":["104.200.153.226","184.170.250.91"],"socksDefault":["104.200.153.226","184.170.250.91"],"enabled":true,"authorized":true},{"id":"dallas","region":"NA","country":"US","lat":32.7767,"lon":-96.797,"scale":1,"name":"US - Dallas, TX","nameFull":"US - Dallas, TX","level":"free","servers":3,"ovHostname":"dallas.cypherpunk.privacy.network","ovDefault":["173.255.138.20"],"ovNone":["173.255.138.20"],"ovStrong":["173.255.138.20"],"ovStealth":["173.255.138.21"],"ipsecHostname":"dallas.cypherpunk.privacy.network","ipsecDefault":["173.255.138.20"],"httpDefault":["173.255.138.20"],"socksDefault":["173.255.138.20"],"enabled":true,"authorized":true},{"id":"losangeles","region":"NA","country":"US","lat":34.0522,"lon":-118.2437,"scale":1,"name":"US - Los Angeles, CA","nameFull":"US - Los Angeles, CA","level":"free","servers":8,"ovHostname":"losangeles.cypherpunk.privacy.network","ovDefault":["184.170.243.67"],"ovNone":["184.170.243.67"],"ovStrong":["184.170.243.67"],"ovStealth":["184.170.243.70"],"ipsecHostname":"losangeles.cypherpunk.privacy.network","ipsecDefault":["184.170.243.67"],"httpDefault":["184.170.243.67"],"socksDefault":["184.170.243.67"],"enabled":true,"authorized":true},{"id":"miami","region":"NA","country":"US","lat":25.6717,"lon":-80.1918,"scale":1,"name":"US - Miami, FL","nameFull":"US - Miami, FL","level":"free","servers":2,"ovHostname":"miami.cypherpunk.privacy.network","ovDefault":["172.98.76.171"],"ovNone":["172.98.76.171"],"ovStrong":["172.98.76.171"],"ovStealth":["172.98.76.172"],"ipsecHostname":"miami.cypherpunk.privacy.network","ipsecDefault":["172.98.76.171"],"httpDefault":["172.98.76.171"],"socksDefault":["172.98.76.171"],"enabled":true,"authorized":true},{"default":true,"id":"newyork","region":"NA","country":"US","lat":40.7128,"lon":-74.0059,"scale":1,"name":"US - New York, NY","nameFull":"US - New York, NY","level":"free","servers":10,"ovHostname":"newyork.cypherpunk.privacy.network","ovDefault":["209.95.51.34"],"ovNone":["209.95.51.34"],"ovStrong":["209.95.51.34"],"ovStealth":["209.95.51.37"],"ipsecHostname":"newyork.cypherpunk.privacy.network","ipsecDefault":["209.95.51.34"],"httpDefault":["209.95.51.34"],"socksDefault":["209.95.51.34"],"enabled":true,"authorized":true},{"id":"newjersey","region":"NA","country":"US","lat":40.0583,"lon":-74.4057,"scale":1,"name":"US - Newark, NJ","nameFull":"US - Newark, NJ","level":"free","servers":2,"ovHostname":"newjersey.cypherpunk.privacy.network","ovDefault":["107.152.101.179"],"ovNone":["107.152.101.179"],"ovStrong":["107.152.101.179"],"ovStealth":["107.152.101.180"],"ipsecHostname":"newjersey.cypherpunk.privacy.network","ipsecDefault":["107.152.101.179"],"httpDefault":["107.152.101.179"],"socksDefault":["107.152.101.179"],"enabled":true,"authorized":true},{"id":"phoenix","region":"NA","country":"US","lat":33.4484,"lon":-112.074,"scale":1,"name":"US - Phoenix, AZ","nameFull":"US - Phoenix, AZ","level":"free","servers":2,"ovHostname":"phoenix.cypherpunk.privacy.network","ovDefault":["172.98.87.3"],"ovNone":["172.98.87.3"],"ovStrong":["172.98.87.3"],"ovStealth":["172.98.87.4"],"ipsecHostname":"phoenix.cypherpunk.privacy.network","ipsecDefault":["172.98.87.3"],"httpDefault":["172.98.87.3"],"socksDefault":["172.98.87.3"],"enabled":true,"authorized":true},{"id":"saltlakecity","region":"NA","country":"US","lat":40.7608,"lon":-111.891,"scale":1,"name":"US - Salt Lake City, UT","nameFull":"US - Salt Lake City, UT","level":"free","servers":2,"ovHostname":"saltlakecity.cypherpunk.privacy.network","ovDefault":["107.182.239.208"],"ovNone":["107.182.239.208"],"ovStrong":["107.182.239.208"],"ovStealth":["107.182.239.209"],"ipsecHostname":"saltlakecity.cypherpunk.privacy.network","ipsecDefault":["107.182.239.208"],"httpDefault":["107.182.239.208"],"socksDefault":["107.182.239.208"],"enabled":true,"authorized":true},{"id":"sanjose","region":"NA","country":"US","lat":37.3382,"lon":-121.8863,"scale":1,"name":"US - San Jose, CA","nameFull":"US - San Jose, CA","level":"free","servers":8,"ovHostname":"sanjose.cypherpunk.privacy.network","ovDefault":["173.255.132.80"],"ovNone":["173.255.132.80"],"ovStrong":["173.255.132.80"],"ovStealth":["173.255.132.81"],"ipsecHostname":"sanjose.cypherpunk.privacy.network","ipsecDefault":["173.255.132.80"],"httpDefault":["173.255.132.80"],"socksDefault":["173.255.132.80"],"enabled":true,"authorized":true},{"id":"seattle","region":"NA","country":"US","lat":47.6062,"lon":-122.3321,"scale":1,"name":"US - Seattle, WA","nameFull":"US - Seattle, WA","level":"free","servers":3,"ovHostname":"seattle.cypherpunk.privacy.network","ovDefault":["67.213.209.128"],"ovNone":["67.213.209.128"],"ovStrong":["67.213.209.128"],"ovStealth":["67.213.209.129"],"ipsecHostname":"seattle.cypherpunk.privacy.network","ipsecDefault":["67.213.209.128"],"httpDefault":["67.213.209.128"],"socksDefault":["67.213.209.128"],"enabled":true,"authorized":true},{"id":"washingtondc","region":"NA","country":"US","lat":38.9072,"lon":-77.0369,"scale":1,"name":"US - Washington D.C.","nameFull":"US - Washington D.C.","level":"free","servers":2,"ovHostname":"washingtondc.cypherpunk.privacy.network","ovDefault":["67.213.214.48"],"ovNone":["67.213.214.48"],"ovStrong":["67.213.214.48"],"ovStealth":["67.213.214.49"],"ipsecHostname":"washingtondc.cypherpunk.privacy.network","ipsecDefault":["67.213.214.48"],"httpDefault":["67.213.214.48"],"socksDefault":["67.213.214.48"],"enabled":true,"authorized":true},{"id":"saopaulo","region":"SA","country":"BR","lat":-23.5505,"lon":-46.6333,"scale":1,"name":"Brazil - Sao Paulo","nameFull":"Brazil - Sao Paulo","level":"free","servers":3,"ovHostname":"saopaulo.cypherpunk.privacy.network","ovDefault":["169.57.159.16"],"ovNone":["169.57.159.16"],"ovStrong":["169.57.159.16"],"ovStealth":["169.57.159.17"],"ipsecHostname":"saopaulo.cypherpunk.privacy.network","ipsecDefault":["169.57.159.16"],"httpDefault":["169.57.159.16"],"socksDefault":["169.57.159.16"],"enabled":true,"authorized":true},{"id":"mexicocity","region":"SA","country":"MX","lat":-19.4326,"lon":99.1332,"scale":1,"name":"Mexico - Mexico City","nameFull":"Mexico - Mexico City","level":"free","servers":2,"ovHostname":"mexicocity.cypherpunk.privacy.network","ovDefault":["169.57.13.0"],"ovNone":["169.57.13.0"],"ovStrong":["169.57.13.0"],"ovStealth":["169.57.13.1"],"ipsecHostname":"melbourne.cypherpunk.privacy.network","ipsecDefault":["169.57.13.0"],"httpDefault":["169.57.13.0"],"socksDefault":["169.57.13.0"],"enabled":true,"authorized":true},{"id":"zurich","region":"EU","country":"CH","lat":47.3769,"lon":8.5417,"scale":1.5,"name":"Switzerland - Zurich","nameFull":"Switzerland - Zurich","level":"free","servers":2,"ovHostname":"zurich.cypherpunk.privacy.network","ovDefault":["81.17.21.194"],"ovNone":["81.17.21.194"],"ovStrong":["81.17.21.194"],"ovStealth":["81.17.21.195"],"ipsecHostname":"zurich.cypherpunk.privacy.network","ipsecDefault":["81.17.21.194"],"httpDefault":["81.17.21.194"],"socksDefault":["81.17.21.194"],"enabled":true,"authorized":true},{"id":"frankfurt","region":"EU","country":"DE","lat":50.1109,"lon":8.6821,"scale":1.5,"name":"Germany - Frankfurt","nameFull":"Germany - Frankfurt","level":"free","servers":3,"ovHostname":"frankfurt.cypherpunk.privacy.network","ovDefault":["158.177.73.128"],"ovNone":["158.177.73.128"],"ovStrong":["158.177.73.128"],"ovStealth":["158.177.73.129"],"ipsecHostname":"frankfurt.cypherpunk.privacy.network","ipsecDefault":["158.177.73.128"],"httpDefault":["158.177.73.128"],"socksDefault":["158.177.73.128"],"enabled":true,"authorized":true},{"id":"paris","region":"EU","country":"FR","lat":48.8566,"lon":2.3522,"scale":1.5,"name":"France - Paris","nameFull":"France - Paris","level":"free","servers":3,"ovHostname":"paris.cypherpunk.privacy.network","ovDefault":["159.8.98.164"],"ovNone":["159.8.98.164"],"ovStrong":["159.8.98.164"],"ovStealth":["159.8.98.165"],"ipsecHostname":"paris.cypherpunk.privacy.network","ipsecDefault":["159.8.98.164"],"httpDefault":["159.8.98.164"],"socksDefault":["159.8.98.164"],"enabled":true,"authorized":true},{"id":"london","region":"EU","country":"GB","lat":51.5074,"lon":0.1278,"scale":1.5,"name":"UK - London","nameFull":"UK - London","level":"free","servers":6,"ovHostname":"london.cypherpunk.privacy.network","ovDefault":["88.202.186.223"],"ovNone":["88.202.186.223"],"ovStrong":["88.202.186.223"],"ovStealth":["88.202.186.226"],"ipsecHostname":"london.cypherpunk.privacy.network","ipsecDefault":["88.202.186.223"],"httpDefault":["88.202.186.223"],"socksDefault":["88.202.186.223"],"enabled":true,"authorized":true},{"id":"iceland","region":"EU","country":"IS","lat":64.1265,"lon":-21.8174,"scale":1.5,"name":"Iceland - Reykajvik","nameFull":"Iceland - Reykajvik","level":"free","servers":3,"ovHostname":"iceland.cypherpunk.privacy.network","ovDefault":["82.221.133.184"],"ovNone":["82.221.133.184"],"ovStrong":["82.221.133.184"],"ovStealth":["82.221.133.185"],"ipsecHostname":"iceland.cypherpunk.privacy.network","ipsecDefault":["82.221.133.184"],"httpDefault":["82.221.133.184"],"socksDefault":["82.221.133.184"],"enabled":true,"authorized":true},{"id":"milan","region":"EU","country":"IT","lat":45.4654,"lon":9.1859,"scale":1.5,"name":"Italy - Milan","nameFull":"Italy - Milan","level":"free","servers":2,"ovHostname":"milan.cypherpunk.privacy.network","ovDefault":["159.122.156.44"],"ovNone":["159.122.156.44"],"ovStrong":["159.122.156.44"],"ovStealth":["159.122.156.45"],"ipsecHostname":"milan.cypherpunk.privacy.network","ipsecDefault":["159.122.156.44"],"httpDefault":["159.122.156.44"],"socksDefault":["159.122.156.44"],"enabled":true,"authorized":true},{"id":"amsterdam","region":"EU","country":"NL","lat":52.3702,"lon":4.8952,"scale":1.5,"name":"Netherlands - Amsterdam","nameFull":"Netherlands - Amsterdam","level":"free","servers":6,"ovHostname":"amsterdam.cypherpunk.privacy.network","ovDefault":["185.80.220.94"],"ovNone":["185.80.220.94"],"ovStrong":["185.80.220.94"],"ovStealth":["46.23.78.30"],"ipsecHostname":"amsterdam.cypherpunk.privacy.network","ipsecDefault":["185.80.220.94"],"httpDefault":["185.80.220.94"],"socksDefault":["185.80.220.94"],"enabled":true,"authorized":true},{"id":"oslo","region":"EU","country":"NO","lat":59.9139,"lon":10.7522,"scale":1.5,"name":"Norway - Oslo","nameFull":"Norway - Oslo","level":"free","servers":2,"ovHostname":"oslo.cypherpunk.privacy.network","ovDefault":["169.51.69.84"],"ovNone":["169.51.69.84"],"ovStrong":["169.51.69.84"],"ovStealth":["169.51.69.85"],"ipsecHostname":"oslo.cypherpunk.privacy.network","ipsecDefault":["169.51.69.84"],"httpDefault":["169.51.69.84"],"socksDefault":["169.51.69.84"],"enabled":true,"authorized":true},{"id":"moscow","region":"EU","country":"RU","lat":55.7558,"lon":37.6173,"scale":1,"name":"Russia - Moscow","nameFull":"Russia - Moscow","level":"free","servers":2,"ovHostname":"moscow.cypherpunk.privacy.network","ovDefault":["158.255.1.89"],"ovNone":["158.255.1.89"],"ovStrong":["158.255.1.89"],"ovStealth":["158.255.1.90"],"ipsecHostname":"moscow.cypherpunk.privacy.network","ipsecDefault":["158.255.1.89"],"httpDefault":["158.255.1.89"],"socksDefault":["158.255.1.89"],"enabled":true,"authorized":true},{"id":"stockholm","region":"EU","country":"SE","lat":59.3293,"lon":18.0686,"scale":1.5,"name":"Sweden - Stockholm","nameFull":"Sweden - Stockholm","level":"free","servers":2,"ovHostname":"stockholm.cypherpunk.privacy.network","ovDefault":["31.3.152.44"],"ovNone":["31.3.152.44"],"ovStrong":["31.3.152.44"],"ovStealth":["31.3.152.45"],"ipsecHostname":"stockholm.cypherpunk.privacy.network","ipsecDefault":["31.3.152.44"],"httpDefault":["31.3.152.44"],"socksDefault":["31.3.152.44"],"enabled":true,"authorized":true},{"id":"hongkong","region":"AS","country":"HK","lat":22.3964,"lon":114.1095,"scale":1.5,"name":"Hong Kong","nameFull":"Hong Kong","level":"free","servers":3,"ovHostname":"hongkong.cypherpunk.privacy.network","ovDefault":["161.202.58.12"],"ovNone":["161.202.58.12"],"ovStrong":["161.202.58.12"],"ovStealth":["161.202.58.13"],"ipsecHostname":"hongkong.cypherpunk.privacy.network","ipsecDefault":["161.202.58.12"],"httpDefault":["161.202.58.12"],"socksDefault":["161.202.58.12"],"enabled":true,"authorized":true},{"id":"chennai","region":"AS","country":"IN","lat":13.0827,"lon":80.2707,"scale":1,"name":"India - Chennai","nameFull":"India - Chennai","level":"free","servers":4,"ovHostname":"chennai.cypherpunk.privacy.network","ovDefault":["169.38.93.4"],"ovNone":["169.38.93.4"],"ovStrong":["169.38.93.4"],"ovStealth":["169.38.93.5"],"ipsecHostname":"chennai.cypherpunk.privacy.network","ipsecDefault":["169.38.93.4"],"httpDefault":["169.38.93.4"],"socksDefault":["169.38.93.4"],"enabled":true,"authorized":true},{"id":"tokyo","region":"AS","country":"JP","lat":35.6895,"lon":139.6917,"scale":1.5,"name":"Japan - Tokyo","nameFull":"Japan - Tokyo","level":"free","servers":1,"ovHostname":"tokyo.cypherpunk.privacy.network","ovDefault":["173.244.192.232"],"ovNone":["173.244.192.232"],"ovStrong":["173.244.192.232"],"ovStealth":["173.244.192.233"],"ipsecHostname":"tokyo.cypherpunk.privacy.network","ipsecDefault":["173.244.192.232"],"httpDefault":["173.244.192.232"],"socksDefault":["173.244.192.232"],"enabled":true,"authorized":true},{"id":"seoul","region":"AS","country":"KR","lat":37.5665,"lon":126.978,"scale":1,"name":"Korea - Seoul","nameFull":"Korea - Seoul","level":"free","servers":3,"ovHostname":"seoul.cypherpunk.privacy.network","ovDefault":["169.56.86.192"],"ovNone":["169.56.86.192"],"ovStrong":["169.56.86.192"],"ovStealth":["169.56.86.193"],"ipsecHostname":"seoul.cypherpunk.privacy.network","ipsecDefault":["169.56.86.192"],"httpDefault":["169.56.86.192"],"socksDefault":["169.56.86.192"],"enabled":true,"authorized":true},{"id":"singapore","region":"AS","country":"SG","lat":1.3521,"lon":103.8198,"scale":1.5,"name":"Singapore","nameFull":"Singapore","level":"free","servers":3,"ovHostname":"singapore.cypherpunk.privacy.network","ovDefault":["173.255.143.60"],"ovNone":["173.255.143.60"],"ovStrong":["173.255.143.60"],"ovStealth":["173.255.143.61"],"ipsecHostname":"singapore.cypherpunk.privacy.network","ipsecDefault":["173.255.143.60"],"httpDefault":["173.255.143.60"],"socksDefault":["173.255.143.60"],"enabled":true,"authorized":true},{"id":"melbourne","region":"OP","country":"AU","lat":-37.8136,"lon":144.9631,"scale":1,"name":"Australia - Melbourne","nameFull":"Australia - Melbourne","level":"free","servers":2,"ovHostname":"melbourne.cypherpunk.privacy.network","ovDefault":["209.95.58.60"],"ovNone":["209.95.58.60"],"ovStrong":["209.95.58.60"],"ovStealth":["209.95.58.61"],"ipsecHostname":"melbourne.cypherpunk.privacy.network","ipsecDefault":["209.95.58.60"],"httpDefault":["209.95.58.60"],"socksDefault":["209.95.58.60"],"enabled":true,"authorized":true},{"id":"sydney","region":"OP","country":"AU","lat":-33.8688,"lon":151.2093,"scale":1,"name":"Australia - Sydney","nameFull":"Australia - Sydney","level":"free","servers":2,"ovHostname":"sydney.cypherpunk.privacy.network","ovDefault":["31.24.225.52"],"ovNone":["31.24.225.52"],"ovStrong":["31.24.225.52"],"ovStealth":["31.24.225.53"],"ipsecHostname":"sydney.cypherpunk.privacy.network","ipsecDefault":["31.24.225.52"],"httpDefault":["31.24.225.52"],"socksDefault":["31.24.225.52"],"enabled":true,"authorized":true},{"id":"honolulu","region":"OP","country":"US","lat":21.3069,"lon":-157.8533,"scale":4,"name":"Honolulu, Hawaii","nameFull":"Honolulu, Hawaii","level":"premium","servers":1,"ovHostname":"honolulu.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"honolulu.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true}]`);
  }

  findRegion(regionId): any {
    let region;
    this.regionArray.map((thisRegion) => {
      if (thisRegion.id === regionId) { region = thisRegion; }
    });
    return region;
  }

  regionSort(a, b): number {
    let value = 0;
    if (a.country > b.country) { value = 1; }
    else if (a.country < b.country) { value = -1; }
    else if (a.country === b.country && a.name > b.name) { value = 1; }
    else if (a.country === b.country && a.name < b.name) { value = -1; }
    return value;
  }

  vanDerGrinten3Raw(lambda, phi) {
    if (Math.abs(phi) < this.epsilon) { return [lambda, 0]; }

    let sinTheta = phi / this.halfPi;
    let theta = Math.asin(sinTheta);

    if (Math.abs(lambda) < this.epsilon || Math.abs(Math.abs(phi) - this.halfPi) < this.epsilon) {
      return [0, this.pi * Math.tan(theta / 2)];
    }

    let A = (this.pi / lambda - lambda / this.pi) / 2;
    let y1 = sinTheta / (1 + Math.cos(theta));

    return [
      this.pi * (Math.sign(lambda) * Math.sqrt(A * A + 1 - y1 * y1) - A),
      this.pi * y1
    ];
  }

  transformToXY(lat, long) {
    let coords = this.vanDerGrinten3Raw((long - 11) * this.pi / 180, lat * this.pi / 180);
    coords[0] = (coords[0] * 150 + (920 / 2)) * (1000 / 920);
    coords[1] = (coords[1] * 150 + (500 / 2 + 500 * 0.15)) * (1000 / 920);
    return coords;
  }

  translateLocations(servers) {
    servers.forEach((server) => {
      if (!server.lat || !server.lon) { return; }
      let [ x, y ] = this.transformToXY(server.lat, server.lon);
      server.mapX = x;
      server.mapY = y;
      server.scale = server.scale || 1;
    });
    return servers;
  }
}
