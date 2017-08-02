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
  @Input() cards;
  @Input() show: boolean;
  defaultCard: any;
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
    form: { valid: false },
    formInstance: {}
  };

  constructor(
    private zone: NgZone,
    private backend: BackendService,
    private alertsService: AlertService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
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

  finalizeDefaultCard() {
    this.state.loading = true;
    let body = { default_source: this.defaultCard.id };
    return this.backend.defaultCard(body, {})
    .then((data) => {
      this.cards = data.sources;
      this.state.loading = false;
    })
    .catch(() => {
      this.alertsService.error('There was an error updating your account');
      this.state.loading = false;
    });
  }

  getToken() {
    if (this.ccButtonDisabled) { return; }
    let stripeForm = this.stripeFormData.formInstance;
    Array.prototype.map.call(document.querySelectorAll('input, select'), (input) => {
      input.focus();
    });

    // name, nameInput
    if (stripeForm['controls'].name.errors) {
      document.getElementById('nameInput').focus();
      return;
    }

    // Credit Card Number errors
    if (stripeForm['controls'].cardNumber.errors) {
      document.getElementById('cardNumberInput').focus();
      return;
    }

    // expiryMonth, ccexpirymonth
    if (stripeForm['controls'].expiryMonth.errors) {
      document.getElementById('ccexpirymonth').focus();
      return;
    }

    // expiryYear, ccexpiryyear
    if (stripeForm['controls'].expiryYear.errors) {
      document.getElementById('ccexpiryyear').focus();
      return;
    }

    // cvc, cccvc
    if (stripeForm['controls'].cvc.errors) {
      document.getElementById('cccvc').focus();
      return;
    }

    // country, country
    if (stripeForm['controls'].country.errors) {
      document.getElementById('country').focus();
      return;
    }

    // zipCode, zipCodeSelect
    if (stripeForm['controls'].zipCode.errors) {
      let el = document.getElementById('zipCodeSelect');
      if (el) { el.focus(); }
      return;
    }

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
    // set cookie
    return this.backend.createCard({ token: token }, {})
    // alert and redirect
    .then((data) => {
      this.zone.run(() => {
        this.cards = data.sources;
        this.defaultCard = this.cards[0];
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
}
