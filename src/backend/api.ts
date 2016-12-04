// Our API for demos only
import {fakeDataBase} from './db';
import {fakeDemoRedisCache} from './cache';

// you would use cookies/token etc
var USER_ID = 'f9d98cf1-1b96-464e-8755-bcc2a5c09077'; // hardcoded as an example

// Our API for demos only
export function serverApi(req, res) {
  let key = USER_ID + '/data.json';
  let cache = fakeDemoRedisCache.get(key);
  if (cache !== undefined) {
    console.log('/data.json Cache Hit');
    return res.json(cache);
  }
  console.log('/data.json Cache Miss');

  fakeDataBase.get()
    .then(data => {
      fakeDemoRedisCache.set(key, data);
      return data;
    })
    .then(data => res.json(data));
}

export function subs(req, res) {
  let body = {};

  if (req.query.secret) {
    body = {
      secret: 'secret',
      privacy: {
        username: 'test',
        password: 'test'
      },
      account: {
        id: '1',
        email: 'test@test.test',
        type: 'premium',
        confirmed: false
      },
      subscription: {
        renewal: 'forever',
        expiration: '0'
      }
    };
  }
  else {
    body = {
      secret: 'secret',
      privacy: {
        username: 'test',
        password: 'test'
      },
      account: {
        id: '1',
        email: 'test@test.test',
        type: 'free',
        confirmed: false
      },
      subscription: {
        renewal: 'forever',
        expiration: '0'
      }
    };
  }

  return res.json(body);
}

export function confirm(req, res) {
  let body = {
    valid: true,
    account: { email: '' },
    secret: ''
  };
  return res.json(body);
}

export function login(req, res) {
  let body = {
    secret: 'abcd',
    privacy: { username: 'username', password: 'password' },
    account: { id: 'id', email: 'test@test.test', confirmed: true, type: 'premium' },
    subscription: { renewal: 'forever', expiration: '0' }
  };
  return res.json(body);
}

export function logout(req, res) {
  return res.json({});
}

export function locations(req, res) {
  let locations = '{"atlanta":{"id":"atlanta","region":"NA","country":"US","name":"Atlanta, Georgia","level":"premium","servers":1,"ovHostname":"atlanta.cypherpunk.privacy.network","ovDefault":["172.98.79.242"],"ovNone":["172.98.79.243"],"ovStrong":["172.98.79.244"],"ovStealth":["172.98.79.245"],"ipsecHostname":"atlanta.cypherpunk.privacy.network","ipsecDefault":["172.98.79.246"],"httpDefault":["172.98.79.247"],"socksDefault":["172.98.79.248"],"enabled":true},"chennai":{"id":"chennai","region":"AS","country":"IN","name":"Chennai, India","level":"premium","servers":1,"ovHostname":"chennai.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"chennai.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"chicago":{"id":"chicago","region":"NA","country":"US","name":"Chicago, Illinois","level":"premium","servers":1,"ovHostname":"chicago.cypherpunk.privacy.network","ovDefault":["104.200.153.226"],"ovNone":["104.200.153.227"],"ovStrong":["104.200.153.228"],"ovStealth":["104.200.153.229"],"ipsecHostname":"chicago.cypherpunk.privacy.network","ipsecDefault":["104.200.153.230"],"httpDefault":["104.200.153.231"],"socksDefault":["104.200.153.232"],"enabled":true},"istanbul":{"id":"istanbul","region":"EU","country":"TR","name":"Istanbul, Turkey","level":"premium","servers":1,"ovHostname":"istanbul.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"instanbul.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"miami":{"id":"miami","region":"NA","country":"US","name":"Miami, Florida","level":"premium","servers":1,"ovHostname":"miami.cypherpunk.privacy.network","ovDefault":["172.98.76.50"],"ovNone":["172.98.76.51"],"ovStrong":["172.98.76.52"],"ovStealth":["172.98.76.53"],"ipsecHostname":"miami.cypherpunk.privacy.network","ipsecDefault":["172.98.76.54"],"httpDefault":["172.98.76.55"],"socksDefault":["172.98.76.56"],"enabled":true},"melbourne":{"id":"melbourne","region":"OP","country":"AU","name":"Melbourne, Australia","level":"premium","servers":1,"ovHostname":"melbourne.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"melbourne.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"milan":{"id":"milan","region":"EU","country":"IT","name":"Milan, Italy","level":"premium","servers":1,"ovHostname":"milan.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"milan.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"montreal":{"id":"montreal","region":"NA","country":"CA","name":"Montreal, Canada","level":"premium","servers":1,"ovHostname":"montreal.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"montreal.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"moscow":{"id":"moscow","region":"EU","country":"RU","name":"Moscow, Russia","level":"premium","servers":1,"ovHostname":"moscow.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"moscow.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"newjersey":{"id":"newjersey","region":"NA","country":"US","name":"Newark, New Jersey","level":"premium","servers":1,"ovHostname":"newjersey.cypherpunk.privacy.network","ovDefault":["172.98.78.98"],"ovNone":["172.98.78.99"],"ovStrong":["172.98.78.100"],"ovStealth":["172.98.78.101"],"ipsecHostname":"newjersey.cypherpunk.privacy.network","ipsecDefault":["172.98.78.102"],"httpDefault":["172.98.78.103"],"socksDefault":["172.98.78.104"],"enabled":true},"oslo":{"id":"oslo","region":"EU","country":"NO","name":"Oslo, Norway","level":"premium","servers":1,"ovHostname":"oslo.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"oslo.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"paris":{"id":"paris","region":"EU","country":"FR","name":"Paris, France","level":"premium","servers":1,"ovHostname":"paris.cypherpunk.privacy.network","ovDefault":["159.8.80.208"],"ovNone":["159.8.80.209"],"ovStrong":["159.8.80.210"],"ovStealth":["159.8.80.211"],"ipsecHostname":"paris.cypherpunk.privacy.network","ipsecDefault":["159.8.80.212"],"httpDefault":["159.8.80.213"],"socksDefault":["159.8.80.214"],"enabled":true},"phoenix":{"id":"phoenix","region":"NA","country":"US","name":"Phoenix, Arizona","level":"premium","servers":1,"ovHostname":"phoenix.cypherpunk.privacy.network","ovDefault":["104.200.133.242"],"ovNone":["104.200.133.243"],"ovStrong":["104.200.133.244"],"ovStealth":["104.200.133.245"],"ipsecHostname":"phoenix.cypherpunk.privacy.network","ipsecDefault":["104.200.133.246"],"httpDefault":["104.200.133.247"],"socksDefault":["104.200.133.248"],"enabled":true},"saltlakecity":{"id":"saltlakecity","region":"NA","country":"US","name":"Salt Lake City, Utah","level":"premium","servers":1,"ovHostname":"saltlakecity.cypherpunk.privacy.network","ovDefault":["173.244.209.73"],"ovNone":["209.95.56.15"],"ovStrong":["209.95.56.16"],"ovStealth":["209.95.56.17"],"ipsecHostname":"saltlakecity.cypherpunk.privacy.network","ipsecDefault":["209.95.56.18"],"httpDefault":["209.95.56.19"],"socksDefault":["209.95.56.20"],"enabled":true},"saopaulo":{"id":"saopaulo","region":"SA","country":"BR","name":"Sao Paulo, Brazil","level":"premium","servers":1,"ovHostname":"saopaulo.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"saopaulo.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"seattle":{"id":"seattle","region":"NA","country":"US","name":"Seattle, Washington","level":"premium","servers":1,"ovHostname":"seattle.cypherpunk.privacy.network","ovDefault":["104.200.129.210"],"ovNone":["104.200.129.211"],"ovStrong":["104.200.129.212"],"ovStealth":["104.200.129.213"],"ipsecHostname":"seattle.cypherpunk.privacy.network","ipsecDefault":["104.200.129.214"],"httpDefault":["104.200.129.215"],"socksDefault":["104.200.129.216"],"enabled":true},"siliconvalley":{"id":"siliconvalley","region":"NA","country":"US","name":"Silicon Valley, California","level":"premium","servers":1,"ovHostname":"siliconvalley.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"siliconvalley.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"singapore":{"id":"singapore","region":"AS","country":"SG","name":"Singapore","level":"premium","servers":1,"ovHostname":"singapore.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"singapore.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"stockholm":{"id":"stockholm","region":"EU","country":"SE","name":"Stockholm, Sweden","level":"premium","servers":1,"ovHostname":"stockholm.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"stockholm.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"sydney":{"id":"sydney","region":"OP","country":"AU","name":"Sydney, Australia","level":"premium","servers":1,"ovHostname":"sydney.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"sydney.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"toronto":{"id":"toronto","region":"NA","country":"CA","name":"Toronto, Canada","level":"premium","servers":1,"ovHostname":"toronto.cypherpunk.privacy.network","ovDefault":["172.98.66.194"],"ovNone":["172.98.66.195"],"ovStrong":["172.98.66.196"],"ovStealth":["172.98.66.197"],"ipsecHostname":"toronto.cypherpunk.privacy.network","ipsecDefault":["172.98.66.198"],"httpDefault":["172.98.66.199"],"socksDefault":["172.98.66.200"],"enabled":true},"washingtondc":{"id":"washingtondc","region":"NA","country":"US","name":"Washington D.C.","level":"premium","servers":1,"ovHostname":"washingtondc.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"washingtondc.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"zurich":{"id":"zurich","region":"EU","country":"CH","name":"Zurich, Switzerland","level":"premium","servers":1,"ovHostname":"zurich.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"zurich.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"amsterdam":{"id":"amsterdam","region":"EU","country":"NL","name":"Amsterdam, Netherlands","level":"free","servers":1,"ovHostname":"amsterdam.cypherpunk.privacy.network","ovDefault":["185.80.221.5"],"ovNone":["185.80.221.34"],"ovStrong":["185.80.221.35"],"ovStealth":["185.80.221.55"],"ipsecHostname":"amsterdam.cypherpunk.privacy.network","ipsecDefault":["185.80.221.90"],"httpDefault":["185.80.221.121"],"socksDefault":["185.80.221.144"],"enabled":true},"frankfurt":{"id":"frankfurt","region":"EU","country":"DE","name":"Frankfurt, Germany","level":"free","servers":1,"ovHostname":"frankfurt.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"frankfurt.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"dallas":{"id":"dallas","region":"NA","country":"US","name":"Dallas, Texas","level":"free","servers":1,"ovHostname":"dallas.cypherpunk.privacy.network","ovDefault":["104.200.142.50"],"ovNone":["104.200.142.51"],"ovStrong":["104.200.142.52"],"ovStealth":["104.200.142.53"],"ipsecHostname":"dallas.cypherpunk.privacy.network","ipsecDefault":["104.200.142.54"],"httpDefault":["104.200.142.55"],"socksDefault":["104.200.142.56"],"enabled":true},"hongkong":{"id":"hongkong","region":"AS","country":"HK","name":"Hong Kong","level":"free","servers":1,"ovHostname":"hongkong.cypherpunk.privacy.network","ovDefault":[],"ovNone":[],"ovStrong":[],"ovStealth":[],"ipsecHostname":"hongkong.cypherpunk.privacy.network","ipsecDefault":[],"httpDefault":[],"socksDefault":[],"enabled":true},"newyork":{"id":"newyork","region":"NA","country":"US","name":"New York, New York","level":"free","servers":1,"ovHostname":"newyork.cypherpunk.privacy.network","ovDefault":["209.95.51.34"],"ovNone":["209.95.51.35"],"ovStrong":["209.95.51.36"],"ovStealth":["209.95.51.37"],"ipsecHostname":"newyork.cypherpunk.privacy.network","ipsecDefault":["209.95.51.38"],"httpDefault":["209.95.51.40"],"socksDefault":["209.95.51.42"],"enabled":true},"losangeles":{"id":"losangeles","region":"NA","country":"US","name":"Los Angeles, California","level":"free","servers":1,"ovHostname":"losangeles.cypherpunk.privacy.network","ovDefault":["174.136.108.243"],"ovNone":["174.136.108.244"],"ovStrong":["174.136.108.245"],"ovStealth":["174.136.108.246"],"ipsecHostname":"losangeles.cypherpunk.privacy.network","ipsecDefault":["174.136.108.247"],"httpDefault":["174.136.108.248"],"socksDefault":["174.136.108.249"],"enabled":true},"london":{"id":"london","region":"EU","country":"GB","name":"London, UK","level":"free","servers":1,"ovHostname":"london.cypherpunk.privacy.network","ovDefault":["88.202.186.223"],"ovNone":["88.202.186.224"],"ovStrong":["88.202.186.225"],"ovStealth":["88.202.186.226"],"ipsecHostname":"london.cypherpunk.privacy.network","ipsecDefault":["88.202.186.227"],"httpDefault":["88.202.186.228"],"socksDefault":["88.202.186.229"],"enabled":true},"vancouver":{"id":"vancouver","region":"NA","country":"CA","name":"Vancouver, Canada","level":"free","servers":1,"ovHostname":"vancouver.cypherpunk.privacy.network","ovDefault":["107.181.189.146"],"ovNone":["107.181.189.147"],"ovStrong":["107.181.189.148"],"ovStealth":["107.181.189.149"],"ipsecHostname":"vancouver.cypherpunk.privacy.network","ipsecDefault":["107.181.189.150"],"httpDefault":["107.181.189.151"],"socksDefault":["107.181.189.152"],"enabled":true}}';
  let loc = JSON.parse(locations);
  return res.json(loc);
}

export function world(req, res) {
  let world = `{
    "region": {
      "NA": "North America",
      "SA": "Central & South America",
      "CR": "Caribbean",
      "OP": "Oceania & Pacific",
      "EU": "Europe",
      "ME": "Middle East",
      "AF": "Africa",
      "AS": "Asia & India Subcontinent",
      "DEV": "Development"
    },
    "regionOrder": [
      "DEV",
      "NA",
      "SA",
      "CR",
      "EU",
      "ME",
      "AF",
      "AS",
      "OP"
    ],
    "country": { "US": "United States" }
  }`;
  let w = JSON.parse(world);
  return res.json(w);
}
