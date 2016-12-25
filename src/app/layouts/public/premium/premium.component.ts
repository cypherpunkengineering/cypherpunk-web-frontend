import { Component, NgZone } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { SessionService } from '../../../services/session.service';
import { PlansService } from '../../../services/plans.service';
import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.css']
})
export class PremiumComponent {
  posData: string = '';
  ccButtonDisabled: boolean = false;
  ppButtonDisabled: boolean = false;
  amButtonDisabled: boolean = false;
  bpButtonDisabled: boolean = false;

  // user variables
  email: string;
  password: string;
  name: string;

  // Stripe variables
  cardNumber: string;
  expiryDate: string;
  cvc: string;

  // Amazon variables
  billingAgreementId: string;
  amazonWallet: any;
  amazonRecurring: any;

  // validation variables
  validCCEmail: boolean = false;
  validCCPass: boolean = false;
  validCCName: boolean = false;
  validCCNumber: boolean = false;
  validCCExpiry: boolean = false;
  validCCcvc: boolean = false;
  ccEmailTouched: boolean = false;
  ccPassTouched: boolean = false;
  ccNameTouched: boolean = false;
  ccNumberTouched: boolean = false;
  ccExpiryTouched: boolean = false;
  ccCVCTouched: boolean = false;

  // payment plans
  plans = this.plansService.plans;
  selectPlan = this.plansService.selectPlan;
  selectedPlan = this.plansService.selectedPlan;

  // payment options
  paymentOptions = [
    {
      type: 'cc',
      selected: true
    },
    {
      type: 'a',
      selected: false
    },
    {
      type: 'pp',
      selected: false
    },
    {
      type: 'bc',
      selected: false
    }
  ];

  selectedOption = this.paymentOptions[0];

  constructor(
    private http: Http,
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private session: SessionService,
    private alertService: AlertService,
    private plansService: PlansService
  ) { }

  // pay with credit card

  getToken() {
    this.ccButtonDisabled = true;

    let month: number;
    let year: number;

    month = Number(this.expiryDate.split('/')[0]);
    year = Number(this.expiryDate.split('/')[1]);

    // stripe params
    let stripeParams = {
      number: this.cardNumber,
      exp_month: month,
      exp_year: year,
      cvc: this.cvc
    };

    // stripe callback
    let stripeCallback = (status: number, response: any) => {
      if (response.error) {
        this.zone.run(() => {
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
      plan: this.selectedPlan.id,
      email: this.email,
      password: this.password
    };

    // call server at this point (using promises)
    let url = '/api/v0/subscription/purchase';
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
      console.log(error);
      this.zone.run(() => {
        this.ccButtonDisabled = false;
        this.alertService.error('Could not create an account');
      });
    });
  }

  // pay with paypal

  payWithPaypal() {
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
      if (this.selectedPlan.id === 'monthly899') {
        document.getElementById('paypalMonthly').click();
      }
      else if (this.selectedPlan.id === 'annually5999') {
        document.getElementById('paypalAnnual').click();
      }
      else if (this.selectedPlan.id === 'semiannually4499') {
        document.getElementById('paypalSemiannual').click();
      }
    })
    // handle errors
    .catch((error) => {
      console.log(error);
      this.zone.run(() => {
        this.ppButtonDisabled = false;
        this.alertService.error('Could not create an account');
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
          if (billingAgreementConsentStatus.getConsentStatus() === 'true') {
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
    this.amButtonDisabled = true;
    /* send billingAgreement to server */
    let serverParams = {
      billingAgreementId: this.billingAgreementId,
      plan: this.selectedPlan.id,
      email: this.email,
      password: this.password
    };

    // call server at this point (using promises)
    let url = '/api/v0/payment/amazon/billingAgreement';
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
      console.log(error);
      this.zone.run(() => {
        this.amButtonDisabled = false;
        this.alertService.error('Could not create an account');
      });
    });
  }

  // pay with bitpay

  payWithBitpay() {
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
        planId: this.selectedPlan.id
      };
      this.posData = JSON.stringify(posId);
    })
    .then(() => {
      if (this.selectedPlan.id === 'monthly899') {
        document.getElementById('bitpayMonthly').click();
      }
      else if (this.selectedPlan.id === 'annually5999') {
        document.getElementById('bitpayAnnual').click();
      }
      else if (this.selectedPlan.id === 'semiannually4499') {
        document.getElementById('bitpaySemiannual').click();
      }
    })
    // handle errors
    .catch((error) => {
      console.log(error);
      this.zone.run(() => {
        this.bpButtonDisabled = false;
        this.alertService.error('Could not create an account');
      });
    });
  }

  // validation functions

  validateCCEmail() {
    this.ccEmailTouched = true;

    if (!this.email) { this.validCCEmail = false; }
    else if (!/^\S+@\S+$/.test(this.email)) { this.validCCEmail = false; }
    else { this.validCCEmail = true; }
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

  validateCC() {
    return this.validCCEmail && this.ccEmailTouched &&
    this.validCCPass && this.ccPassTouched &&
    this.validCCName && this.ccNameTouched &&
    this.validCCNumber && this.ccNumberTouched &&
    this.validCCExpiry && this.ccExpiryTouched &&
    this.validCCcvc && this.ccCVCTouched;
  }

  validatePP() {
    if (!this.email || !this.password) { return false; }
    else { return true; }
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // option functions

  selectOption(option) {
    this.selectedOption = option;
    this.paymentOptions.map((item) => { item.selected = false; });
    option.selected = true;

    // launch amazon payments
    if (option.type === 'a') {
      setTimeout(() => { this.amazonInit(); }, 100);
    }
  }

}
