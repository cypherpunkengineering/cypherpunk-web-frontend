import { isPlatformBrowser, Location } from '@angular/common';
import { GlobalsService } from '../../../services/globals.service';
import country_list from '../../../layouts/public/pricing/countries';
import { Component, PLATFORM_ID, Input, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-stripe-cc-form',
  templateUrl: './stripe-cc-form.component.html',
  styleUrls: ['./stripe-cc-form.component.css']
})
export class StripeCCFormComponent implements OnInit {
  @Input() stripeFormData: any;
  countries = country_list;
  stripeDevKey = 'pk_test_V8lLSY93CP6w9SFgqCmw8FUg';
  stripeProdKey = 'pk_live_R2Y6CVvD6azFMaYvu99eKQkh';
  stripeKey = this.stripeDevKey;

  stripeForm: FormGroup;
  name: AbstractControl;
  cardNumber: AbstractControl;
  expiryDate: AbstractControl;
  expiryYear: AbstractControl;
  expiryMonth: AbstractControl;
  cvc: AbstractControl;
  country: AbstractControl;
  zipCode: AbstractControl;

  yearArray = [];
  monthArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private globals: GlobalsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // load stripe js files
    if (isPlatformBrowser(this.platformId)) {
      // load stripe dev
      if (globals.ENV === 'PROD') { this.stripeKey = this.stripeProdKey; }
      this.loadStripe(this.stripeKey);
    }

    // generate year array
    let yearMin = new Date().getFullYear();
    for (let i = 0; i < 21; i++) {
      this.yearArray.push(yearMin + i);
    }
  }

  ngOnInit() {
    this.stripeForm = this.fb.group({
      name: [this.stripeFormData.name, Validators.required],
      cardNumber: [
        this.stripeFormData.cardNumber,
        Validators.compose([
          Validators.required,
          NumberValidator.validate
        ])
      ],
      expiryYear: [
        this.stripeFormData.year,
        Validators.compose([
          Validators.required,
          Validators.maxLength(4)
        ])
      ],
      expiryMonth: [
        this.stripeFormData.month,
        Validators.compose([
          Validators.required,
          Validators.maxLength(2)
        ])
      ],
      cvc: [
        this.stripeFormData.cvc,
        Validators.compose([
          Validators.required,
          Validators.maxLength(5),
          CvcValidator.validate
        ])
      ],
      country: [this.stripeFormData.country, Validators.required],
      zipCode: [this.stripeFormData]
    });

    this.stripeFormData.formInstance = this.stripeForm;

    this.name = this.stripeForm.controls['name'];
    this.cardNumber = this.stripeForm.controls['cardNumber'];
    this.expiryDate = this.stripeForm.controls['expiryDate'];
    this.expiryMonth = this.stripeForm.controls['expiryMonth'];
    this.expiryYear = this.stripeForm.controls['expiryYear'];
    this.cvc = this.stripeForm.controls['cvc'];
    this.country = this.stripeForm.controls['country'];
    this.zipCode = this.stripeForm.controls['zipCode'];

    this.stripeForm.valueChanges.subscribe((form: any) => {
      let dirty = this.stripeForm.dirty;
      let valid = this.stripeForm.valid;
      let zipCodeValid = true;

      if (this.stripeFormData.country === 'United States' ||
          this.stripeFormData.country === 'United Kingdom' ||
          this.stripeFormData.country === 'Canada') {
        zipCodeValid = !!this.stripeFormData.zipCode;
      }

      this.stripeFormData.form.valid = dirty && valid && zipCodeValid;
    });
  }

  isAmex(ccn) {
    if (typeof ccn !== 'string') ccn = this.stripeFormData.cardNumber;
    return ccn.startsWith('34') || ccn.startsWith('37');
  }

  checkCCNumber(e) {
    do {
      let input = e.key;
      if (!/^[0-9]+$/.test(input)) { break; }
      let ccn = this.stripeFormData.cardNumber;
      if (this.isAmex(ccn) && ((ccn.length + 1) > 15)) { break; }
      else if ((ccn.length + 1) > 21) { break; }
      return;
    } while (false);
    e.preventDefault();
  }

  checkCVCNumber(e) {
    do {
      let input = e.key;
      if (!/^[0-9]+$/.test(input)) { break; }
      if ((this.stripeFormData.cvc.length + 1) > 4) { break; }
      return;
    } while (false);
    e.preventDefault();
  }

  loadStripe(key) {
    /*
    if (!document.getElementById('stripe-init')) {
      let stripeInit = document.createElement('script');
      stripeInit.setAttribute('id', 'stripe-init');
      stripeInit.setAttribute('type', 'text/javascript');
      stripeInit.innerHTML = `
        window.stripeOnload = function() { Stripe.setPublishableKey('${key}'); }
      `;
      document.body.appendChild(stripeInit);
    }
    */
    if (!document.getElementById('stripe-v2')) {
      let stripe = document.createElement('script');
      stripe.setAttribute('id', 'stripe-v2');
      stripe.setAttribute('type', 'text/javascript');
      //stripe.setAttribute('onload', 'stripeOnload()');
      stripe.setAttribute('src', 'https://js.stripe.com/v2/');
      stripe.addEventListener('load', event => {
        (<any>window).Stripe.setPublishableKey(key);
        this.stripeForm.markAsDirty();
      });
      document.body.appendChild(stripe);
    }
  }
}

interface ValidationResult { [key: string]: boolean; }

class NumberValidator {
  static validate(control: FormControl): ValidationResult {
    if (control.value) {
      let stripe = (<any>window).Stripe;
      //if (!stripe) { return { 'stripeNotFound': true }; }
      if (stripe) {
        let passStripeValidation = stripe.card.validateCardNumber(control.value);
        if (passStripeValidation) { return null; }
        else { return { 'invalidCreditCardNumber': true }; }
      }
    }
    else { return null; }
  }
}

class CvcValidator {
  static validate(control: FormControl): ValidationResult {
    if (control.value) {
      let stripe = (<any>window).Stripe;
      //if (!stripe) { return { 'stripeNotFound': true }; }
      if (stripe) {
        let passStripeValidation = stripe.card.validateCVC(control.value);
        if (passStripeValidation) { return null; }
        else { return { 'invalidExpiryDate': true }; }
      }
    }
    else { return null; }
  }

  constructor() {}
}
