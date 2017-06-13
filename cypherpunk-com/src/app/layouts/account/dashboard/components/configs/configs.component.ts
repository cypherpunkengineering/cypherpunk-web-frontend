import { Component, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'account-configs',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.css']
})
export class AccountConfigsComponent {
  loading = true;
  vpnSelect = 'openvpn';
  openvpnLocation = { hostname: '', display: false };
  ipsecLocation = { hostname: '', display: true };
  ikeLocation = { hostname: '', display: true };
  httpLocation = { hostname: '', display: true };

  constructor() { }
}
