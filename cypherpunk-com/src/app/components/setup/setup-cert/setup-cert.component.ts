import { Component } from '@angular/core';

@Component({
  selector: 'app-setup-cert',
  templateUrl: './setup-cert.component.html',
  styleUrls: ['./setup-cert.component.css']
})
export class SetupCertComponent {
  cert = [
    '-----BEGIN CERTIFICATE-----',
    'MIICPzCCAcagAwIBAgIJAMLqTfX9NxfOMAoGCCqGSM49BAMCMF4xCzAJBgNVBAYT',
    'AklTMSIwIAYDVQQKDBlDeXBoZXJwdW5rIFBhcnRuZXJzLCBTbGYuMSswKQYDVQQD',
    'DCJDeXBoZXJwdW5rIFByaXZhY3kgTmV0d29yayBSb290IENBMB4XDTE3MDcwNDEw',
    'MjQ0M1oXDTM3MDYyOTEwMjQ0M1owXjELMAkGA1UEBhMCSVMxIjAgBgNVBAoMGUN5',
    'cGhlcnB1bmsgUGFydG5lcnMsIFNsZi4xKzApBgNVBAMMIkN5cGhlcnB1bmsgUHJp',
    'dmFjeSBOZXR3b3JrIFJvb3QgQ0EwdjAQBgcqhkjOPQIBBgUrgQQAIgNiAARrlCaM',
    'MANPH64vDoI+MdnebGKoeik6rvPiocsfhd0Sup7VLsCeVsGy9ix++fwZbSvyIuhW',
    'FUcYKjrIBUgdAAoTes27O8HFcKvqh9KhsJR3N5EZOJeW9hBrSJPUzQD04m2jUDBO',
    'MB0GA1UdDgQWBBSRIb30U/AwnK9dFL90/5PfBoG/YDAfBgNVHSMEGDAWgBSRIb30',
    'U/AwnK9dFL90/5PfBoG/YDAMBgNVHRMEBTADAQH/MAoGCCqGSM49BAMCA2cAMGQC',
    'MHyZTGMvj72Cr6QI/O1GygRcB+eJ0h+995tYolp3opomfB7okVCep+VOcAGfwgA5',
    'bAIwf9rCYJmZXbJdIh66Y3ANpuD0zy6vVSTF4l/MLVkivqbd08u4kutNR/OTkAy9',
    'OPgc',
    '-----END CERTIFICATE-----',
  ].join('\r\n');

  copy(element: string) {
    let el = (document.getElementById(element)) as HTMLTextAreaElement;

    try {
      el.select();
      document.execCommand('copy');
      el.blur();
    }
    catch(err) {
      alert('Please press Ctrl/Cmd + C to copy');
    }
  }
}
