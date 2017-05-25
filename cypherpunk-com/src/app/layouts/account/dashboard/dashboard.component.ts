import { RequestOptions } from '@angular/http';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import { Component, PLATFORM_ID, Inject, NgZone, OnInit } from '@angular/core';
import country_list from '../../public/pricing/countries';
import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  upgrade = true;
  loading = true;
  showConfirmMessage = false;
  showEmailModal = false;
  showPasswordModal = false;
  countries = country_list;
  showPPWarning = false;

  // payment details
  defaultCardId = '';
  defaultCard: any = {};
  cards = [];
  showPaymentDetails = false;
  showCreateCard = false;
  ccButtonDisabled = false;
  stripeFormData = {
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    country: '',
    zipCode: '',
    form: { valid: false }
  };

  constructor(
    private zone: NgZone,
    private router: Router,
    private authGuard: AuthGuard,
    private session: SessionService,
    private backend: BackendService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // handle title
    this.document.title = 'My Account with Cypherpunk Privacy';

    // set user
    this.user = this.session.user;

    // redirect user if not logged in
    if (isPlatformBrowser(this.platformId)) {
      let route = activatedRoute.snapshot;
      let state = router.routerState.snapshot;
      this.authGuard.canActivate(route, state)
      .then((data) => {
        this.zone.run(() => {
          this.loading = false;
          if (!data.account.confirmed) {
            alertService.warning('Your account is not confirmed! Please check your email and click on the link to confirm your account.');
          }
        });
      })
      .catch(() => { /* keep error from showing up in console */ });
    }

    // load stripe js files
    if (isPlatformBrowser(this.platformId)) {
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

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((qParams) => {
      let tx = qParams['tx'];
      let st = qParams['st'];
      if (!tx || st !== 'Completed') { return; }
      if (tx && st === 'Completed') { this.showPPWarning = true; }
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
    let body = { default_source: this.defaultCard.id };
    let options = new RequestOptions({});
    return this.backend.defaultCard(body, options)
    .then((data) => {
      this.defaultCardId = data.default_source;
      this.cards = data.sources;
      this.loading = false;
      return this.defaultCardId;
    })
    .catch(() => {
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

    month = Number(this.stripeFormData.expiryDate.split('/')[0]);
    year = Number(this.stripeFormData.expiryDate.split('/')[1]);

    // stripe params
    let stripeParams = {
      name: this.stripeFormData.name,
      number: this.stripeFormData.cardNumber,
      exp_month: month,
      exp_year: year,
      cvc: this.stripeFormData.cvc,
      address_zip: this.stripeFormData.zipCode,
      address_country: this.stripeFormData.country
    };
    if (!this.stripeFormData.zipCode) { delete stripeParams.address_zip; }


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
    let body = { token: token };
    let options = new RequestOptions({});
    // set cookie
    return this.backend.createCard(body, options)
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
      this.zone.run(() => {
        this.loading = false;
        this.ccButtonDisabled = false;
        this.alertService.error('Error: ' + error.message);
      });
    });
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

}
