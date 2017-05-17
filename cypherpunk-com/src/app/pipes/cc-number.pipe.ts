import { Pipe, PipeTransform } from '@angular/core';

/*
 * Display as formatted Credit Card Number
 * Usage:
 *   ccNumber
 * Example:
 *   {{ 4242424242424242 }}
 *   formats to: 4242 4242 4242 4242
*/
@Pipe({name: 'CCNumber'})
export class CCNumberPipe implements PipeTransform {
  transform(value: string): string {
    let output = '';
    value = value.replace(/ /g, '');
    let charArray = value.split('');

    // AMEX Format
    if (value.startsWith('37') || value.startsWith('34')) {
      if (charArray.length > 4 && charArray.length <= 10) {
        charArray.splice(4, 0, ' ');
      }
      else if (charArray.length > 10) {
        charArray.splice(4, 0, ' ');
        charArray.splice(11, 0, ' ');
      }
    }
    // Normal Format
    else {
      if (charArray.length > 4 && charArray.length <= 8) {
        charArray.splice(4, 0, ' ');
      }
      else if (charArray.length > 8 && charArray.length <= 12) {
        charArray.splice(4, 0, ' ');
        charArray.splice(9, 0, ' ');
      }
      else if (charArray.length > 12) {
        charArray.splice(4, 0, ' ');
        charArray.splice(9, 0, ' ');
        charArray.splice(14, 0, ' ');
      }
    }

    output = charArray.join('');

    return output;
  }
}
