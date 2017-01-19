import { isBrowser } from 'angular2-universal';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, RequestOptions, Response } from '@angular/http';
import { AlertService } from '../../../services/alert.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import country_list from '../../public/pricing/countries';
import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  upgrade: boolean = true;
  loading: boolean = true;
  showEmailModal: boolean = false;
  showPasswordModal: boolean = false;
  countries = country_list;
  ppPDTToken: string = 'LmIFezNvuok97Nk07H7-stpgqy5TfFDwzqkj5Ye6uSqOPE7vEsttiCxPGcy';
  showPPWarning: boolean = false;

  // payment details
  defaultCardId: string = '';
  defaultCard: any = {};
  cards = [];
  showPaymentDetails: boolean = false;
  showCreateCard: boolean = false;
  name: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  country: string;
  zipCode: string;
  showZip: boolean = false;

  // validation variables
  validCCName: boolean = false;
  validCCNumber: boolean = false;
  validCCExpiry: boolean = false;
  validCCcvc: boolean = false;
  validCountry: boolean = false;
  validZipCode: boolean = false;
  ccNameTouched: boolean = false;
  ccNumberTouched: boolean = false;
  ccExpiryTouched: boolean = false;
  ccCVCTouched: boolean = false;
  countryTouched: boolean = false;
  zipCodeTouched: boolean = false;
  ccButtonDisabled: boolean = false;

  constructor(
    private http: Http,
    private zone: NgZone,
    private router: Router,
    private authGuard: AuthGuard,
    private session: SessionService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute
  ) {
    this.user = this.session.user;

    // redirect user if not logged in
    if (isBrowser) {
      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.authGuard.canActivate(route, state)
      .then((data) => { this.loading = false; })
      .catch(() => { /* keep error from showing up in console */ });
    }

    // load stripe js files
    if (isBrowser) {
      if (!document.getElementById('stripe-init')) {
        let stripeInit = document.createElement('script');
        stripeInit.setAttribute('id', 'stripe-init');
        stripeInit.setAttribute('type', 'text/javascript');
        stripeInit.innerHTML = `
        window.stripeOnload = function() {
          Stripe.setPublishableKey('pk_test_V8lLSY93CP6w9SFgqCmw8FUg');
        }
        `;
        document.body.appendChild(stripeInit);
      }

      if (!document.getElementById('stripe-v2')) {
        let stripe = document.createElement('script');
        stripe.setAttribute('id', 'stripe-v2');
        stripe.setAttribute('type', 'text/javascript');
        stripe.setAttribute('onload', 'stripeOnload()');
        stripe.setAttribute('src', 'https://js.stripe.com/v2/');
        document.body.appendChild(stripe);
      }
    }

    // get all stripe cards for this user
    if (isBrowser) {
      let url = '/api/v0/account/source/list';
      http.get(url)
      .map(res => res.json())
      .subscribe((data: any) => {
        this.defaultCardId = data.default_source;
        this.cards = data.sources;
        this.cards.map((card) => {
          if (card.id === data.default_source) { this.defaultCard = card; }
        });

        if (!this.cards.length) {
          this.showCreateCard = true;
          this.defaultCard.id = '';
          this.defaultCardId = '';
        }
      });
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((qParams) => {
      console.log(qParams);
      let tx = qParams['tx'];
      if (!tx) { return; }
      else { this.showPPWarning = true; }

      if (isBrowser) {
        let url = 'https://www.sandbox.paypal.com/cgi-bin/webscr';
        let body = {
          tx: tx,
          at: this.ppPDTToken
        };
        this.http.post(url, body)
        .map(res => res.json())
        .subscribe((data: any) => {
          console.log(data);
        });
      }
    });
  }

  showPriceBoxes() {
    let type = this.user.account.type;
    let renewal = this.user.subscription.renewal;

    if (type === 'free') { return true; }
    else if (type === 'premium') {
      if (renewal !== 'annually' && renewal !== 'forever') { return true; }
    }
    else { return false; }
  }

  openEmailModal() {
    this.showEmailModal = true;
    setTimeout(() => { document.getElementById('dashboardEmail').focus(); }, 510);
  }

  openPasswordModal() {
    this.showPasswordModal = true;
    setTimeout(() => { document.getElementById('dashboardPassword').focus(); }, 510);
  }

  changeCountry() {
    let currentCountry = this.country;

    if (currentCountry === 'United States' ||
        currentCountry === 'United Kingdom' ||
        currentCountry === 'Canada') {
      this.showZip = true;
    }
    else { this.showZip = false; }

    return this.validateCountry();
  }

  setCard() {
    if (this.defaultCard === 'Add New Card') {
      this.cards.map((card) => {
        if (card.id === this.defaultCardId) { this.defaultCard = card; }
      });
      this.showCreateCard = true;
    }
    else { this.showCreateCard = false; }
  }

  finalizeDefaultCard() {
    this.loading = true;
    let url = '/api/v0/account/source/default';
    let body = { default_source: this.defaultCard.id };
    let options = new RequestOptions({});
    return this.http.post(url, body, options).toPromise()
    .then((res: Response) => {
      let resData = res.json() || {};
      this.defaultCardId = resData.default_source;
      this.cards = resData.sources;
      this.loading = false;
      return this.defaultCardId;
    })
    .catch((err) => {
      this.alertService.error('There was an error updating your account');
      this.loading = false;
    });
  }

  getToken() {
    // show loading overlay
    this.loading = true;
    this.ccButtonDisabled = true;

    let month: number;
    let year: number;

    month = Number(this.expiryDate.split('/')[0]);
    year = Number(this.expiryDate.split('/')[1]);

    // stripe params
    let stripeParams = {
      name: this.name,
      number: this.cardNumber,
      exp_month: month,
      exp_year: year,
      cvc: this.cvc,
      address_zip: '',
      address_country: this.country
    };
    if (this.zipCode) { stripeParams.address_zip = this.zipCode; }
    else { delete stripeParams.address_zip; }

    // stripe callback
    let stripeCallback = (status: number, response: any) => {
      if (response.error) {
        this.zone.run(() => {
          this.loading = false;
          this.alertService.error('Could not process payment: ' + response.error.message);
        });
      }
      else {
        let token = response.id;
        return this.createCard(token);
      }
    };

    // load up stripe and create token
    let stripe = (<any>window).Stripe;
    stripe.card.createToken(stripeParams, stripeCallback);
  }

  createCard(token) {
    this.ccButtonDisabled = true;
    let url = '/api/v0/account/source/add';
    let body = { token: token };
    let options = new RequestOptions({});
    // set cookie
    return this.http.post(url, body, options).toPromise()
    .then((res: Response) => {
      let resData = res.json() || {};
      return resData;
    })
    // alert and redirect
    .then((data) => {
      this.zone.run(() => {
        this.defaultCardId = data.default_source;
        this.cards = data.sources;
        this.cards.map((card) => {
          if (card.id === data.default_source) { this.defaultCard = card; }
        });
        this.loading = false;
        this.showCreateCard = false;
        this.ccButtonDisabled = false;
      });
    })
    // handle errors
    .catch((error) => {
      let errorData = error.json() || {};
      this.zone.run(() => {
        this.loading = false;
        this.ccButtonDisabled = false;
        this.alertService.error('Error: ' + errorData.message);
      });
    });
  }

  // validation functions

  validateCCName() {
    this.ccNameTouched = true;

    if (!this.name) { this.validCCName = false; }
    else { this.validCCName = true; }
    return this.validCCName;
  }

  validateCCNumber() {
    this.ccNumberTouched = true;

    let stripe = (<any>window).Stripe;
    this.validCCNumber = stripe.card.validateCardNumber(this.cardNumber);
    return this.validCCNumber;
  }

  validateCCExpiry() {
    this.ccExpiryTouched = true;

    if (this.expiryDate && this.expiryDate.length === 2) { this.expiryDate += '/'; }

    let stripe = (<any>window).Stripe;
    this.validCCExpiry = stripe.card.validateExpiry(this.expiryDate);
    if (this.validCCExpiry) { document.getElementById('cccvc').focus(); }
    return this.validCCExpiry;
  }

  validateCCcvc() {
    this.ccCVCTouched = true;

    let stripe = (<any>window).Stripe;
    this.validCCcvc = stripe.card.validateCVC(this.cvc);
    return this.validCCcvc;
  }

  validateCountry() {
    this.countryTouched = true;

    if (!this.country) { this.validCountry = false; }
    else { this.validCountry = true; }
    return this.validCountry;
  }

  validateZipCode() {
    this.zipCodeTouched = true;

    if (!this.zipCode) { this.validZipCode = false; }
    else { this.validZipCode = true; }
    return this.validZipCode;
  }

  validateCC() {
    let valid = this.validCCName && this.ccNameTouched &&
    this.validCCNumber && this.ccNumberTouched &&
    this.validCCExpiry && this.ccExpiryTouched &&
    this.validCCcvc && this.ccCVCTouched &&
    this.validCountry && this.countryTouched;

    if (this.country === 'United States' ||
    this.country === 'United Kingdom' ||
    this.country === 'Canada') {
      valid = valid && this.validZipCode && this.zipCodeTouched;
    }

    return valid;
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

}
