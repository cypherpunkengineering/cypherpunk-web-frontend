import { isPlatformBrowser } from '@angular/common';
import { AlertService } from '../../../../../services/alert.service';
import { BackendService } from '../../../../../services/backend.service';
import { Component, Input, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import country_list from '../../../../public/pricing/countries';

@Component({
  selector: 'account-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class AccountPaymentComponent {
  @Input() state;
  @Input() show: boolean;
  defaultCardId = '';
  defaultCard: any = {};
  cards = [];
  showCreateCard = false;
  ccButtonDisabled = false;
  countries = country_list;
  stripeFormData = {
    name: '',
    cardNumber: '',
    month: '',
    year: '',
    cvc: '',
    country: '',
    zipCode: '',
    form: { valid: false }
  };

  constructor(
    private zone: NgZone,
    private backend: BackendService,
    private alertsService: AlertService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // get all stripe cards for this user
    if (isPlatformBrowser(this.platformId)) {
      backend.cards()
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
      }, () => {});
    }

    // use Geo-IP to preload CC country
    if (isPlatformBrowser(this.platformId)) {
      backend.networkStatus()
      .subscribe((data: any) => {
        if (data.country === 'ZZ') { return; }

        this.countries.map((country) => {
          if (country.code === data.country) {
            this.stripeFormData.country = country.name;
          }
        });
      });
    }
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
    this.state.loading = true;
    let body = { default_source: this.defaultCard.id };
    return this.backend.defaultCard(body, {})
    .then((data) => {
      this.defaultCardId = data.default_source;
      this.cards = data.sources;
      this.state.loading = false;
      return this.defaultCardId;
    })
    .catch(() => {
      this.alertsService.error('There was an error updating your account');
      this.state.loading = false;
    });
  }

  getToken() {
    // show state.loading overlay
    this.state.loading = true;
    this.ccButtonDisabled = true;

    // stripe params
    let stripeParams = {
      name: this.stripeFormData.name,
      number: this.stripeFormData.cardNumber,
      exp_month: this.stripeFormData.month,
      exp_year: this.stripeFormData.year,
      cvc: this.stripeFormData.cvc,
      address_zip: this.stripeFormData.zipCode,
      address_country: this.stripeFormData.country
    };
    if (!this.stripeFormData.zipCode) { delete stripeParams.address_zip; }

    // stripe callback
    let stripeCallback = (status: number, response: any) => {
      if (response.error) {
        this.zone.run(() => {
          this.state.loading = false;
          this.alertsService.error('Could not process payment: ' + response.error.message);
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
    let body = { token: token };
    // set cookie
    return this.backend.createCard(body, {})
    // alert and redirect
    .then((data) => {
      this.zone.run(() => {
        this.defaultCardId = data.default_source;
        this.cards = data.sources;
        this.cards.map((card) => {
          if (card.id === data.default_source) { this.defaultCard = card; }
        });
        this.state.loading = false;
        this.showCreateCard = false;
        this.ccButtonDisabled = false;
      });
    })
    // handle errors
    .catch((error) => {
      this.zone.run(() => {
        this.state.loading = false;
        this.ccButtonDisabled = false;
        this.alertsService.error('Error: ' + error.message);
      });
    });
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}
