import { Component, Input } from '@angular/core';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-setup-generator',
  templateUrl: './setup-generator.component.html',
  styleUrls: ['./setup-generator.component.css']
})
export class SetupGeneratorComponent {
  @Input() showCredentials: boolean;
  profile = '';
  profileCert = '';
  profilePartial = '';
  useCypherplay = false;
  splitTextFields = false;
  downloadButtonEnabled = false;
  openvpnLocation = { hostname: '', display: false };
  showWarning: boolean;

  constructor(private session: SessionService) {
    this.showWarning = !!!this.session.user.privacy.username;
  }

  updateProfile() { this.generateProfile(); }

  generateProfile() {
    let hostname = this.openvpnLocation.hostname;
    let partial = [
      'client',
      'dev tun',
      'nobind',
      'resolv-retry infinite',
      'route-delay 0',
      'redirect-gateway autolocal',
      'tun-mtu 1500',
      'mssfix 1280',
      'tls-version-min 1.2',
      'remote-cert-eku "TLS Web Server Authentication"',
      'tls-cipher TLS-DHE-RSA-WITH-AES-256-GCM-SHA384:TLS-DHE-RSA-WITH-AES-256-CBC-SHA256',
      'auth SHA256',
      'proto udp',
      'remote ' + hostname + ' 7133',
      'cipher AES-128-CBC',
      'auth-user-pass'
    ];

    if (this.useCypherplay) {
      partial = partial.concat([
        'pull-filter ignore "dhcp-option DNS 10.10.10.10"',
        'pull-filter ignore "route 10.10.10.10 255.255.255.255"',
        'dhcp-option DNS 10.10.10.14',
        'dhcp-option DNS 10.10.11.14',
        'dhcp-option DNS 10.10.12.14',
        'route 10.10.10.14',
        'route 10.10.11.14',
        'route 10.10.12.14'
      ]);
    }

    let cert = [
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
    ];

    // generate full profile
    let fullProfilePartialClone = partial.slice(0);
    let fullProfileCertClone = cert.slice(0);
    fullProfilePartialClone.push('<ca>');
    fullProfilePartialClone = fullProfilePartialClone.concat(fullProfileCertClone);
    fullProfilePartialClone.push('</ca>');
    this.profile = fullProfilePartialClone.join('\r\n');

    // generate partial profile
    let profilePartialClone = partial.slice(0);
    this.profilePartial = profilePartialClone.join('\r\n');

    // generate certificate
    let profileCertClone = cert.slice(0);
    this.profileCert = profileCertClone.join('\r\n');

    this.downloadButtonEnabled = true;
  }

  downloadProfile() {
    this.downloadButtonEnabled = false;
    let profile = this.profile;

    let hostname = this.openvpnLocation.hostname;
    let filename = hostname + '.conf.ovpn';

    let blob = new Blob([profile], {type: 'text/text'});
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    }
    else {
      let elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }

    this.downloadButtonEnabled = true;
  }

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
