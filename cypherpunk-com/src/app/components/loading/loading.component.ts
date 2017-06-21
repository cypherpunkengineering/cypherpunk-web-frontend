import { isPlatformBrowser } from '@angular/common';
import { Component, Input, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements AfterViewInit {
  @Input('state') state = true;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser =  isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) { let ticker = new Ticker(this.isBrowser).reset(); }
  }
}

class Ticker {
  done = false;
  cycleCount = 5;
  cycleCurrent = 0;
  letters = [];
  letterCount: number;
  letterCurrent = 0;
  chars = 'abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-_=+{}|[]\\;\':"<>?,./`~'.split('');

  constructor(isBrowser: boolean) {
    if (isBrowser) {
      let nodeList = document.querySelectorAll('.char');
      for (let i = 0; i < nodeList.length; i++) {
        this.letters.push(nodeList[i]);
      }
      this.letterCount = this.letters.length;
      this.letters.forEach((el) => {
        el.setAttribute('data-orig', el.innerText);
        el.innerHTML = '-';
      });
    }
  }

  getChar() {
    return this.chars[ Math.floor( Math.random() * this.chars.length ) ];
  }

  reset() {
    this.done = false;
    this.cycleCurrent = 0;
    this.letterCurrent = 0;
    this.letters.forEach((el) => {
      el.innerHTML = el.getAttribute('data-orig');
      el.classList.remove('done');
    });
    this.loop();
  }

  loop() {
    this.letters.forEach((elem, index) => {
      if (index >= this.letterCurrent) {
        let text = elem.innerText || elem.textContent;
        if (text !== ' ') {
          elem.innerHTML = this.getChar();
          elem.style.opacity = Math.random().toString();
        }
      }
    });

    if (this.cycleCurrent < this.cycleCount) { this.cycleCurrent++; }
    else if (this.letterCurrent < this.letterCount) {
      let currLetter = this.letters[this.letterCurrent];
      this.cycleCurrent = 0;
      currLetter.innerHTML = currLetter.getAttribute('data-orig');
      currLetter.style.opacity = '1';
      currLetter.classList.add('done');
      this.letterCurrent++;
    }
    else { this.done = true; }

    if (!this.done) { requestAnimationFrame(() => { this.loop(); }); }
    else { setTimeout(() => { this.reset(); }, 750 ); }
  }
}
