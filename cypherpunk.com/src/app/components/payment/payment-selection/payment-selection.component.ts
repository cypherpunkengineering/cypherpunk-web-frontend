import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-payment-selection',
  templateUrl: './payment-selection.component.html',
  styleUrls: ['./payment-selection.component.css']
})
export class PaymentSelectionComponent {
  @Input() paymentMethod: string;
  @Output() selectOption: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  update(method) {
    this.paymentMethod = method;
    this.selectOption.emit(this.paymentMethod);
  }
}
