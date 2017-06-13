import { Component } from '@angular/core';

@Component({
  selector: 'account-configs',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.css']
})
export class AccountConfigsComponent {
  vpnSelect = 'openvpn';
  ipsecLocation = { hostname: '', display: true };
  ikeLocation = { hostname: '', display: true };
  httpLocation = { hostname: '', display: true };

  constructor() { }

  addIp() { }
}
