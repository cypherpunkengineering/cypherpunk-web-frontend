import { Component, Inject } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { SessionService } from '../../../services/session.service';
import { PlansService } from '../../../services/plans.service';
import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent {
  message: string;
  messageClass: string = '';

  // Stripe variables
  cardNumber: string;
  expiryDate: string;
  cvc: string;

  // user variables
  email: string;
  password: string;
  name: string;

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
      type: 'pp',
      selected: false
    },
    {
      type: 'bc',
      selected: false
    },
    {
      type: 'a',
      selected: false
    }
  ];

  selectedOption = this.paymentOptions[0];

  constructor(
    private http: Http,
    private router: Router,
    private auth: AuthService,
    private session: SessionService,
    private alertService: AlertService,
    private plansService: PlansService
  ) { }

  // pay with credit card

  getToken() {
    if (!this.validateCC()) { return; }

    // show user we're charging the card
    this.message = 'Loading...';

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
      let token = response.id;
      return this.saveToServer(token);
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
    let url = '/api/subscription/purchase';
    let body = serverParams;
    let options = new RequestOptions({});
    // sets cookie
    return this.http.post(url, body, options).toPromise()
    // set user session
    .then((res: Response) => {
      let resData = res.json() || {};
      this.session.setUserData({
        email: resData.acct.email,
        secret: resData.secret
      });
    })
    // turn on authed
    .then(() => { this.auth.authed = true; })
    // alert and redirect
    .then(() => {
      this.alertService.success('You account was created!');
      this.router.navigate(['/user']);
    })
    // handle errors
    .catch((error) => {
      console.log(error);
      this.alertService.error('Could not create an account');
    });
  }

  // pay with paypal

  payWithPaypal() {
    if (!this.validatePP()) { return; }

    let serverParams = {
      email: this.email,
      password: this.password
    };

    // call server at this point (using promises)
    let url = '/account/register/signup';
    let body = serverParams;
    let options = new RequestOptions({});
    // sets cookie
    return this.http.post(url, body, options).toPromise()
    // set user session
    .then((res: Response) => {
      let resData = res.json() || {};
      this.session.setUserData({
        email: resData.acct.email,
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
      if (this.selectedPlan.id === 'monthly999') {
        document.getElementById('paypalMonthly').click();
      }
      else if (this.selectedPlan.id === 'annually8004') {
        document.getElementById('paypalAnnual').click();
      }
      else if (this.selectedPlan.id === 'semiannually4998') {
        document.getElementById('paypalSemiannual').click();
      }
    })
    // handle errors
    .catch((error) => {
      console.log(error);
      this.alertService.error('Could not create an account');
    });
  }

  // pay with amazon

  goToBitPay() { console.log('not implemented yet'); }

  amazon() {
    let authRequest;
    let wallet = this.createWallet;
    let recur = this.createRecurring;
    OffAmazonPayments.Button(
      'AmazonPayButton',
      'A3SJRQ5XVLYGMV', {
        type:  'PwA',
        color: 'Gold',
        size:  'medium',
        authorization: function() {
          let loginOptions = {
            scope: 'profile',
            popup: 'true'
          };
          authRequest = amazon.Login.authorize(loginOptions);
          console.log(authRequest);
          wallet(recur);
        },
        onError: function(error) { console.log(error); }
      }
    );
  }

  createWallet(recur) {
    let billingAgreementId;

    new OffAmazonPayments.Widgets.Wallet({
      sellerId: 'A3SJRQ5XVLYGMV',
      onReady: function(billingAgreement) {
        billingAgreementId = billingAgreement.getAmazonBillingAgreementId();
      },
      agreementType: 'BillingAgreement',
      design: { designMode: 'responsive' },
      onPaymentSelect: function(billingAgreement) {
         // Replace this code with the action that you want to perform
         // after the payment method is selected.
         console.log(billingAgreement);
         recur(billingAgreementId);
      },
      onError: function(error) { console.log(error); }
    }).bind('walletWidgetDiv');
  }

  createRecurring(billingAgreementId) {
    let buyerBillingAgreementConsentStatus;
    new OffAmazonPayments.Widgets.Consent({
      sellerId: 'A3SJRQ5XVLYGMV',
      // amazonBillingAgreementId obtained from the Amazon Address Book widget.
      amazonBillingAgreementId: billingAgreementId,
      design: { designMode: 'responsive' },
      onReady: function(billingAgreementConsentStatus){
        // Called after widget renders
        buyerBillingAgreementConsentStatus =
          billingAgreementConsentStatus.getConsentStatus();
        // getConsentStatus returns true or false
        // true – checkbox is selected
        // false – checkbox is unselected - default
      },
      onConsent: function(billingAgreementConsentStatus) {
        buyerBillingAgreementConsentStatus =
          billingAgreementConsentStatus.getConsentStatus();
        // getConsentStatus returns true or false
        // true – checkbox is selected – buyer has consented
        // false – checkbox is unselected – buyer has not consented

        // Replace this code with the action that you want to perform
        // after the consent checkbox is selected/unselected.
        console.log(buyerBillingAgreementConsentStatus);
      },
      onError: function(error) { console.log(error); }
    }).bind('consentWidgetDiv');
  }

  setBilling() {
    
  }

  validateCC() {
    if (!this.email) {
      this.message = 'Email is required';
      this.messageClass = 'error';
      return false;
    }

    if (!this.password) {
      this.message = 'Password is required';
      this.messageClass = 'error';
      return false;
    }

    if (!this.name) {
      this.message = 'Name is required';
      this.messageClass = 'error';
      return false;
    }

    if (!this.cardNumber) {
      this.message = 'Credit Card is required';
      this.messageClass = 'error';
      return false;
    }

    if (!this.expiryDate) {
      this.message = 'Expiration is required';
      this.messageClass = 'error';
      return false;
    }
    else if (this.expiryDate) {
      let month = this.expiryDate.split('/')[0];
      let year = this.expiryDate.split('/')[1];

      if (!this.isNumber(month)) {
        this.message = 'Month is not a number';
        this.messageClass = 'error';
        return false;
      }
      if (!this.isNumber(year)) {
        this.message = 'Year is not a number';
        this.messageClass = 'error';
        return false;
      }
    }

    if (!this.cvc) {
      this.message = 'CVC/CVV number is required';
      this.messageClass = 'error';
      return false;
    }

    this.message = '';
    this.messageClass = '';
    return true;
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
  }

}
