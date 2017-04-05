import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './android.component.html',
  styleUrls: ['./android.component.css']
})
export class AndroidComponent {
  switch1: boolean = true;
  switch2: boolean = true;
  switch3: boolean = true;
  switch4: boolean = true;
  switch5: boolean = true;
  switch6: boolean = true;
  switch7: boolean = true;
  switch8: boolean = true;

  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Cypherpunk Android VPN & Online Privacy App';
  }
}