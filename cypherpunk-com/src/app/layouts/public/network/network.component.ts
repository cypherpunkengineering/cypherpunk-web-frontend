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

    this.locationArray = JSON.parse(`[{"id":"montreal","region":"NA","country":"CA","lat":-45.5017,"lon":-73.5673,"scale":1,"name":"Montreal, Canada","level":"premium","servers":2,"ovHostname":"montreal.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"montreal.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":274.03487826646193,"mapY":214.2412309894754},{"id":"toronto","region":"NA","country":"CA","lat":-43.6532,"lon":-79.3832,"scale":1,"name":"Toronto, Canada","level":"premium","servers":2,"ovHostname":"toronto.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"toronto.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":256.70579014377,"mapY":220.72216372534052},{"id":"vancouver","region":"NA","country":"CA","lat":-49.2827,"lon":-123.1207,"scale":1,"name":"Vancouver, Canada","level":"free","servers":3,"ovHostname":"vancouver.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"vancouver.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":140.616183285552,"mapY":200.55514760761676},{"id":"atlanta","region":"NA","country":"US","lat":-33.749,"lon":-84.388,"scale":1,"name":"Atlanta, Georgia","level":"premium","servers":3,"ovHostname":"atlanta.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"atlanta.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":236.63724023502434,"mapY":253.58652588333896},{"id":"chicago","region":"NA","country":"US","lat":-41.8781,"lon":-87.6298,"scale":1,"name":"Chicago, Illinois","level":"premium","servers":3,"ovHostname":"chicago.cypherpunk.privacy.network","ovDefault":["104.200.153.226"],"ovNone":["104.200.153.226"],"ovStrong":["104.200.153.226"],"ovStealth":["104.200.153.229"],"ipsecHostname":"chicago.cypherpunk.privacy.network","ipsecDefault":["104.200.153.226"],"httpDefault":["104.200.153.226"],"socksDefault":["104.200.153.226"],"enabled":true,"authorized":true,"mapX":232.6311516046515,"mapY":226.8301437245766},{"id":"dallas","region":"NA","country":"US","lat":-32.7767,"lon":-96.797,"scale":1,"name":"Dallas, Texas","level":"free","servers":3,"ovHostname":"dallas.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"dallas.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":201.3323267741984,"mapY":256.67349931061807},{"id":"losangeles","region":"NA","country":"US","lat":-34.0522,"lon":-118.2437,"scale":1,"name":"Los Angeles, California","level":"free","servers":8,"ovHostname":"losangeles.cypherpunk.privacy.network","ovDefault":["184.170.243.67"],"ovNone":["184.170.243.67"],"ovStrong":["184.170.243.67"],"ovStealth":["184.170.243.70"],"ipsecHostname":"losangeles.cypherpunk.privacy.network","ipsecDefault":["184.170.243.67"],"httpDefault":["184.170.243.67"],"socksDefault":["184.170.243.67"],"enabled":true,"authorized":true,"mapX":141.6692578013242,"mapY":252.6195115609693},{"id":"miami","region":"NA","country":"US","lat":-25.6717,"lon":-80.1918,"scale":1,"name":"Miami, Florida","level":"premium","servers":2,"ovHostname":"miami.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"miami.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":244.89607015159783,"mapY":278.6586668315006},{"id":"newyork","region":"NA","country":"US","default":true,"lat":-40.7128,"lon":-74.0059,"scale":1,"name":"New York, New York","level":"free","servers":10,"ovHostname":"newyork.cypherpunk.privacy.network","ovDefault":["209.95.51.34"],"ovNone":["209.95.51.34"],"ovStrong":["209.95.51.34"],"ovStealth":["209.95.51.37"],"ipsecHostname":"newyork.cypherpunk.privacy.network","ipsecDefault":["209.95.51.34"],"httpDefault":["209.95.51.34"],"socksDefault":["209.95.51.34"],"enabled":true,"authorized":true,"mapX":269.5099485515731,"mapY":230.7826314945587},{"id":"newjersey","region":"NA","country":"US","lat":-40.0583,"lon":-74.4057,"scale":1,"name":"Newark, New Jersey","level":"premium","servers":2,"ovHostname":"newjersey.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"newjersey.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":267.9958411494301,"mapY":232.98375025414094},{"id":"phoenix","region":"NA","country":"US","lat":-33.4484,"lon":-112.074,"scale":1,"name":"Phoenix, Arizona","level":"premium","servers":2,"ovHostname":"phoenix.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"phoenix.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":158.7120999758568,"mapY":254.5431716727636},{"id":"saltlakecity","region":"NA","country":"US","lat":-40.7608,"lon":-111.891,"scale":1,"name":"Salt Lake City, Utah","level":"premium","servers":2,"ovHostname":"saltlakecity.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"saltlakecity.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":164.143984819404,"mapY":230.62068089820707},{"id":"seattle","region":"NA","country":"US","lat":-47.6062,"lon":-122.3321,"scale":1,"name":"Seattle, Washington","level":"premium","servers":3,"ovHostname":"seattle.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"seattle.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":141.03245309502157,"mapY":206.69931830225633},{"id":"siliconvalley","region":"NA","country":"US","lat":-37.3875,"lon":-122.0575,"scale":1,"name":"Silicon Valley, California","level":"premium","servers":8,"ovHostname":"siliconvalley.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"siliconvalley.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":133.08027149220595,"mapY":241.83456942354093},{"id":"washingtondc","region":"NA","country":"US","lat":-38.9072,"lon":-77.0369,"scale":1,"name":"Washington D.C.","level":"premium","servers":2,"ovHostname":"washingtondc.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"washingtondc.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":260.0103212760138,"mapY":236.82355142335905},{"id":"saopaulo","region":"SA","country":"BR","lat":23.5505,"lon":-46.6333,"scale":1,"name":"Sao Paulo, Brazil","level":"premium","servers":3,"ovHostname":"saopaulo.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"saopaulo.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":338.63749443666455,"mapY":421.46547778435576},{"id":"zurich","region":"EU","country":"CH","lat":-47.3769,"lon":8.5417,"scale":1.5,"name":"Zurich, Switzerland","level":"premium","servers":2,"ovHostname":"zurich.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"zurich.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":493.5707076346543,"mapY":207.53001372922103},{"id":"frankfurt","region":"EU","country":"DE","lat":-50.1109,"lon":8.6821,"scale":1.5,"name":"Frankfurt, Germany","level":"free","servers":3,"ovHostname":"frankfurt.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"frankfurt.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":494.0141439689868,"mapY":197.47195808227465},{"id":"paris","region":"EU","country":"FR","lat":-48.8566,"lon":2.3522,"scale":1.5,"name":"Paris, France","level":"premium","servers":3,"ovHostname":"paris.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"paris.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":477.5292835494964,"mapY":202.128815006587},{"id":"london","region":"EU","country":"GB","lat":-51.5074,"lon":0.1278,"scale":1.5,"name":"London, UK","level":"free","servers":6,"ovHostname":"london.cypherpunk.privacy.network","ovDefault":["88.202.186.223"],"ovNone":["88.202.186.223"],"ovStrong":["88.202.186.223"],"ovStealth":["88.202.186.226"],"ipsecHostname":"london.cypherpunk.privacy.network","ipsecDefault":["88.202.186.223"],"httpDefault":["88.202.186.223"],"socksDefault":["88.202.186.223"],"enabled":true,"authorized":true,"mapX":472.110619469257,"mapY":192.19660418142874},{"id":"milan","region":"EU","country":"IT","lat":-45.4654,"lon":9.1859,"scale":1.5,"name":"Milan, Italy","level":"premium","servers":2,"ovHostname":"milan.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"milan.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":495.21724218618186,"mapY":214.3697497683578},{"id":"amsterdam","region":"EU","country":"NL","lat":-52.3702,"lon":4.8952,"scale":1.5,"name":"Amsterdam, Netherlands","level":"free","servers":6,"ovHostname":"amsterdam.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"amsterdam.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":484.41506712038927,"mapY":188.88678768395215},{"id":"oslo","region":"EU","country":"NO","lat":-59.9139,"lon":10.7522,"scale":1.5,"name":"Oslo, Norway","level":"premium","servers":2,"ovHostname":"oslo.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"oslo.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":499.3973335765128,"mapY":157.9880596780751},{"id":"moscow","region":"EU","country":"RU","lat":-55.7558,"lon":37.6173,"scale":1,"name":"Moscow, Russia","level":"premium","servers":2,"ovHostname":"moscow.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"moscow.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":566.7923525108401,"mapY":175.48813765835303},{"id":"stockholm","region":"EU","country":"SE","lat":-59.3293,"lon":18.0686,"scale":1.5,"name":"Stockholm, Sweden","level":"premium","servers":2,"ovHostname":"stockholm.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"stockholm.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":517.2706153848915,"mapY":160.52742938627537},{"id":"istanbul","region":"EU","country":"TR","lat":-41.0082,"lon":28.9784,"scale":1.5,"name":"Istanbul, Turkey","level":"premium","servers":2,"ovHostname":"istanbul.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"instanbul.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":548.2148724269151,"mapY":229.7848084108198},{"id":"hongkong","region":"AS","country":"HK","lat":-22.3964,"lon":114.1095,"scale":1.5,"name":"Hong Kong","level":"free","servers":3,"ovHostname":"hongkong.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"hongkong.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":789.8721674140626,"mapY":288.51020143345374},{"id":"chennai","region":"AS","country":"IN","lat":-13.0827,"lon":80.2707,"scale":1,"name":"Chennai, India","level":"premium","servers":4,"ovHostname":"chennai.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"chennai.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":696.2026096365987,"mapY":315.8333718646184},{"id":"tokyo","region":"AS","country":"JP","lat":-35.6895,"lon":139.6917,"scale":1.5,"name":"Tokyo, Japan","level":"premium","servers":1,"ovHostname":"tokyo.cypherpunk.privacy.network","ovDefault":["173.244.192.232"],"ovNone":["173.244.192.232"],"ovStrong":["173.244.192.232"],"ovStealth":["173.244.192.233"],"ipsecHostname":"tokyo.cypherpunk.privacy.network","ipsecDefault":["173.244.192.232"],"httpDefault":["173.244.192.232"],"socksDefault":["173.244.192.232"],"enabled":true,"authorized":true,"mapX":855.7509939256033,"mapY":247.35996153554896},{"id":"singapore","region":"AS","country":"SG","lat":-1.3521,"lon":103.8198,"scale":1.5,"name":"Singapore","level":"premium","servers":3,"ovHostname":"singapore.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"singapore.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":764.1204734557294,"mapY":349.41305513252064},{"id":"melbourne","region":"OP","country":"AU","lat":37.8136,"lon":144.9631,"scale":1,"name":"Melbourne, Australia","level":"premium","servers":2,"ovHostname":"melbourne.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"melbourne.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":869.1732212622272,"mapY":466.08570587766104},{"id":"sydney","region":"OP","country":"AU","lat":33.8688,"lon":151.2093,"scale":1,"name":"Sydney, Australia","level":"premium","servers":2,"ovHostname":"sydney.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"sydney.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true,"authorized":true,"mapX":889.4241776441812,"mapY":453.31704578170115}]`);
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
