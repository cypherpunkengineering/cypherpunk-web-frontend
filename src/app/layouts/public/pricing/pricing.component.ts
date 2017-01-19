import { isBrowser } from 'angular2-universal';
import { Component, NgZone } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthGuard } from '../../../services/auth-guard.service';
import { AlertService } from '../../../services/alert.service';
import { SessionService } from '../../../services/session.service';
import { PlansService } from '../../../services/plans.service';
import 'rxjs/add/operator/toPromise';
import country_list from './countries';

@Component({
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent {
  posData: string = '';
  ccButtonDisabled: boolean = false;
  ppButtonDisabled: boolean = false;
  amButtonDisabled: boolean = false;
  bpButtonDisabled: boolean = false;
  loading: boolean = false;
  modal = { show: false, header: '', body: '', link: false };
  countries = country_list;

  // user variables
  email: string;
  password: string;
  name: string;

  // Stripe variables
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  country: string;
  zipCode: string;
  showZip: boolean = false;

  // Amazon variables
  billingAgreementId: string;
  amazonWallet: any;
  amazonRecurring: any;

  // bitpay variables
  bpRate: number;
  showBTC: boolean = false;

  // validation variables
  validCCEmail: boolean = false;
  validCCPass: boolean = false;
  validCCName: boolean = false;
  validCCNumber: boolean = false;
  validCCExpiry: boolean = false;
  validCCcvc: boolean = false;
  validCountry: boolean = false;
  validZipCode: boolean = false;
  ccEmailTouched: boolean = false;
  ccPassTouched: boolean = false;
  ccNameTouched: boolean = false;
  ccNumberTouched: boolean = false;
  ccExpiryTouched: boolean = false;
  ccCVCTouched: boolean = false;
  countryTouched: boolean = false;
  zipCodeTouched: boolean = false;

  // payment options (cc, a, pp, bc)
  selectedOption = 'cc';

  constructor(
    private http: Http,
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private authGuard: AuthGuard,
    private session: SessionService,
    private alertService: AlertService,
    private plansService: PlansService
  ) {
    // redirect if user is already logged in
    if (isBrowser) {
      this.authGuard.shouldUpgrade()
      .then(() => {
        let redirect = true;
        let type = session.user.account.type;
        let renewal = session.user.subscription.renewal;
        if (type === 'free') { redirect = false; }
        else if (type === 'premium') {
          if (renewal !== 'annually' && renewal !== 'forever') { redirect = false; }
        }
        if (redirect) { router.navigate(['/account/upgrade']); }
        else { router.navigate(['/account']); }
      })
      .catch(() => { });
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

    // load amazon js files
    if (isBrowser) {
      if (!document.getElementById('amazon-init')) {
        let amazonInit = document.createElement('script');
        amazonInit.setAttribute('id', 'amazon-init');
        amazonInit.setAttribute('type', 'text/javascript');
        amazonInit.innerHTML = `
          window.onAmazonLoginReady = function() {
            var cid = 'amzn1.application-oa2-client.ecc2bfbfc6fa421b973018ecb6f4bc36';
            amazon.Login.setClientId(cid);
          };
        `;
        document.body.appendChild(amazonInit);
      }

      if (!document.getElementById('amazon-widget')) {
        let amazon = document.createElement('script');
        amazon.setAttribute('id', 'amazon-widget');
        amazon.setAttribute('type', 'text/javascript');
        amazon.setAttribute('async', 'async');
        amazon.setAttribute('src', 'https://static-na.payments-amazon.com/OffAmazonPayments/us/sandbox/js/Widgets.js');
        document.body.appendChild(amazon);
      }
    }

    // use Geo-IP to preload CC country
    if (isBrowser) {
      let url = '/api/v0/network/status';
      http.get(url)
      .map(res => res.json())
      .subscribe((data: any) => {
        if (data.country === 'ZZ') { return; }

        this.countries.map((country) => {
          if (country.code === data.country) {
            this.country = country.name;
            this.changeCountry();
          }
        });
      });
    }

    // get rates for bitpay
    if (isBrowser) {
      let url = 'https://bitpay.com/api/rates/usd';
      http.get(url)
      .map(res => res.json())
      .subscribe((data: any) => {
        if (data.rate) {this.bpRate = data.rate; }
        this.plansService.plans[0].bcPrice = this.bpConvert(this.plansService.plans[0].price);
        this.plansService.plans[2].bcPrice = this.bpConvert(this.plansService.plans[2].price);
        this.plansService.plans[1].bcPrice = this.bpConvert(this.plansService.plans[1].price);
        this.plansService.plans[0].bcTotal = this.bpConvert(this.plansService.plans[0].total);
        this.plansService.plans[2].bcTotal = this.bpConvert(this.plansService.plans[2].total);
        this.plansService.plans[1].bcTotal = this.bpConvert(this.plansService.plans[1].total);
        this.plansService.plans[0].bcYearly = `₿ ~${this.plansService.plans[0].bcTotal} / monthly`;
        this.plansService.plans[2].bcYearly = `₿ ~${this.plansService.plans[2].bcTotal} / semiannually`;
        this.plansService.plans[1].bcYearly = `₿ ~${this.plansService.plans[1].bcTotal} / annually`;
      });
    }
  }

  // pay with credit card

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
        return this.saveToServer(token);
      }
    };

    // load up stripe and create token
    let stripe = (<any>window).Stripe;
    stripe.card.createToken(stripeParams, stripeCallback);
  }

  saveToServer(token: string) {
    let serverParams = {
      token: token,
      plan: this.plansService.selectedPlan.id,
      email: this.email,
      password: this.password
    };

    // call server at this point (using promises)
    let url = '/api/v0/account/purchase/stripe';
    let body = serverParams;
    let options = new RequestOptions({});
    // sets cookie
    return this.http.post(url, body, options).toPromise()
    // set user session
    .then((res: Response) => {
      let resData = res.json() || {};
      this.session.setUserData({
        account: { email: resData.account.email },
        secret: resData.secret
      });
    })
    // turn on authed
    .then(() => { this.auth.authed = true; })
    // alert and redirect
    .then(() => {
      this.alertService.success('You account was created!');
      this.router.navigate(['/account']);
    })
    // handle errors
    .catch((error) => {
      let errorData = error.json() || {};
      this.zone.run(() => {
        this.loading = false;
        this.ccButtonDisabled = false;

        this.modal.header = 'Error: ' + errorData.message;
        this.modal.link = false;
        this.modal.show = true;
      });
    });
  }

  // pay with paypal

  payWithPaypal() {
    this.loading = true;
    this.ppButtonDisabled = true;

    let serverParams = {
      email: this.email,
      password: this.password
    };

    // call server at this point (using promises)
    let url = '/api/v0/account/register/signup';
    let body = serverParams;
    let options = new RequestOptions({});
    // sets cookie
    return this.http.post(url, body, options).toPromise()
    // set user session
    .then((res: Response) => {
      let resData = res.json() || {};
      this.session.setUserData({
        account: { email: resData.account.email },
        secret: resData.secret
      });
    })
    // turn on authed
    .then(() => { this.auth.authed = true; })
    // alert and redirect to paypal
    .then(() => {
      this.alertService.success('You account was created!');
    })
    .then(() => {
      if (this.plansService.selectedPlan.id === 'monthly899') {
        document.getElementById('paypalMonthly').click();
      }
      else if (this.plansService.selectedPlan.id === 'annually5999') {
        document.getElementById('paypalAnnual').click();
      }
      else if (this.plansService.selectedPlan.id === 'semiannually4499') {
        document.getElementById('paypalSemiannual').click();
      }
    })
    // handle errors
    .catch((error) => {
      let errorData = error.json() || {};
      this.zone.run(() => {
        this.loading = false;
        this.ppButtonDisabled = false;

        this.modal.header = 'Error: Could not process your payment';
        this.modal.body = errorData.message;
        this.modal.link = false;
        this.modal.show = true;
      });
    });
  }

  // pay with amazon

  amazonInit() {
    let amazon = (<any>window).amazon;
    let OffAmazonPayments = (<any>window).OffAmazonPayments;

    OffAmazonPayments.Button(
      'AmazonPayButton',
      'A2FF2JPNM9GYDJ', {
        type:  'PwA',
        color: 'Gold',
        size:  'medium',
        authorization: () => {
          amazon.Login.authorize({ scope: 'profile', popup: 'true' });
          this.zone.run(() => { this.amazonCreateWallet(); });
        },
        onError: (error) => { console.log(error); }
      }
    );
  }

  amazonCreateWallet() {
    let OffAmazonPayments = (<any>window).OffAmazonPayments;
    document.getElementById('walletWidgetDiv').style.display = 'block';

    if (!this.amazonWallet) {
      new OffAmazonPayments.Widgets.Wallet({
        sellerId: 'A2FF2JPNM9GYDJ',
        onReady: (billingAgreement) => {
          this.billingAgreementId = billingAgreement.getAmazonBillingAgreementId();
        },
        agreementType: 'BillingAgreement',
        design: { designMode: 'responsive' },
        onPaymentSelect: (billingAgreement) => {
          this.zone.run(() => { this.amazonCreateRecurring(); });
        },
        onError: (error) => { console.log(error); }
      }).bind('walletWidgetDiv');
    }
  }

  amazonCreateRecurring () {
    let OffAmazonPayments = (<any>window).OffAmazonPayments;
    document.getElementById('consentWidgetDiv').style.display = 'block';

    if (!this.amazonRecurring) {
      new OffAmazonPayments.Widgets.Consent({
        sellerId: 'A2FF2JPNM9GYDJ',
        // amazonBillingAgreementId obtained from the Amazon Address Book widget.
        amazonBillingAgreementId: this.billingAgreementId,
        design: { designMode: 'responsive' },
        // Called after widget renders
        onReady: (billingAgreementConsentStatus) => {
          let getStatus = billingAgreementConsentStatus.getConsentStatus;
          if (getStatus && getStatus() === 'true') {
            document.getElementById('payWithAmazon').style.display = 'inline';
          }
        },
        onConsent: (billingAgreementConsentStatus) => {
          if (billingAgreementConsentStatus.getConsentStatus() === 'true') {
            document.getElementById('payWithAmazon').style.display = 'inline';
          }
          else {
            window.alert('Please allow for future payments to join Cypherpunk.');
            document.getElementById('payWithAmazon').style.display = 'none';
          }
        },
        onError: (error) => { console.log(error); }
      }).bind('consentWidgetDiv');
    }
  }

  amazonButton() {
    this.loading = true;
    this.amButtonDisabled = true;

    /* send billingAgreement to server */
    let serverParams = {
      AmazonBillingAgreementId: this.billingAgreementId,
      plan: this.plansService.selectedPlan.id,
      email: this.email,
      password: this.password
    };

    // call server at this point (using promises)
    let url = '/api/v0/account/purchase/amazon';
    let body = serverParams;
    let options = new RequestOptions({});
    // sets cookie
    return this.http.post(url, body, options).toPromise()
    // set user session
    .then((res: Response) => {
      let resData = res.json() || {};
      this.session.setUserData({
        account: { email: resData.account.email },
        secret: resData.secret
      });
    })
    // turn on authed
    .then(() => { this.auth.authed = true; })
    // alert and redirect
    .then(() => {
      this.alertService.success('You account was created!');
      this.router.navigate(['/account']);
    })
    // handle errors
    .catch((error) => {
      let errorData = error.json() || {};
      this.zone.run(() => {
        this.loading = false;
        this.amButtonDisabled = false;

        this.modal.header = 'Error: ' + errorData.message;
        this.modal.link = false;
        this.modal.show = true;
      });
    });
  }

  // pay with bitpay

  bpConvert(usd: number): number {
    if (this.bpRate) { return +(usd / this.bpRate).toFixed(3); }
    else { return -1; }
  }

  payWithBitpay() {
    this.loading = true;
    this.bpButtonDisabled = true;

    let serverParams = {
      email: this.email,
      password: this.password
    };

    // call server at this point (using promises)
    let url = '/api/v0/account/register/signup';
    let body = serverParams;
    let options = new RequestOptions({});
    // sets cookie
    return this.http.post(url, body, options).toPromise()
    // set user session
    .then((res: Response) => {
      let resData = res.json() || {};
      this.session.setUserData({
        account: { email: resData.account.email },
        secret: resData.secret
      });
    })
    // turn on authed
    .then(() => { this.auth.authed = true; })
    .then(() => { this.alertService.success('You account was created!'); })
    .then(() => {
      let posId = {
        email: this.email,
        planId: this.plansService.selectedPlan.id
      };
      this.posData = JSON.stringify(posId);
    })
    .then(() => {
      if (this.plansService.selectedPlan.id === 'monthly899') {
        document.getElementById('bitpayMonthly').click();
      }
      else if (this.plansService.selectedPlan.id === 'annually5999') {
        document.getElementById('bitpayAnnual').click();
      }
      else if (this.plansService.selectedPlan.id === 'semiannually4499') {
        document.getElementById('bitpaySemiannual').click();
      }
    })
    // handle errors
    .catch((error) => {
      let errorData = error.json() || {};
      this.zone.run(() => {
        this.loading = false;
        this.bpButtonDisabled = false;

        this.modal.header = 'Error: Could not process your payment';
        this.modal.body = errorData.message;
        this.modal.link = false;
        this.modal.show = true;
      });
    });
  }

  // validation functions

  validateCCEmail(onBlur: boolean) {
    this.ccEmailTouched = true;

    if (!this.email) { this.validCCEmail = false; }
    else if (!/^\S+@\S+$/.test(this.email)) { this.validCCEmail = false; }
    else { this.validCCEmail = true; }

    if (onBlur && this.validCCEmail) {
      // call server at this point (using promises)
      let serverParams = { email: this.email };
      let url = '/api/v0/account/identify/email';
      let body = serverParams;
      let options = new RequestOptions({});
      this.http.post(url, body, options).toPromise()
      .then(() => {
        this.modal.header = 'It looks like your already a Cypherpunk!';
        this.modal.body = `Why not upgrade your account here: `;
        this.modal.link = true;
        this.modal.show = true;
      })
      .catch((data) => {
        if (data.status === 401) { this.validCCEmail = true; }
        else { this.validCCEmail = false; }
      });
    }

    return this.validCCEmail;
  }

  validateCCPass() {
    this.ccPassTouched = true;

    if (!this.password) { this.validCCPass = false; }
    else { this.validCCPass = true; }
    return this.validCCPass;
  }

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
    let valid = this.validCCEmail && this.ccEmailTouched &&
    this.validCCPass && this.ccPassTouched &&
    this.validCCName && this.ccNameTouched &&
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

  validatePP() {
    return this.validCCEmail && this.ccEmailTouched &&
    this.validCCPass && this.ccPassTouched;
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // option functions

  selectOption(option) {
    this.selectedOption = option;

    // launch amazon payments
    if (this.selectedOption === 'a') {
      this.showBTC = false;
      setTimeout(() => { this.amazonInit(); }, 100);
    }
    else if (this.selectedOption === 'bc') { this.showBTC = true; }
    else { this.showBTC = false; }
  }

}
