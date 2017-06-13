import { Component } from '@angular/core';
import { BackendService } from '../../../../../services/backend.service';

@Component({
  selector: 'account-dns',
  templateUrl: './dns.component.html',
  styleUrls: ['./dns.component.css']
})
export class AccountDnsComponent {


  constructor(private backend: BackendService) {}

  addIp() {

  }
}
