import { isBrowser } from 'angular2-universal';
import { Component, Input, OnInit } from '@angular/core';
import country_list from '../../../layouts/public/pricing/countries';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-stripe-cc-form',
  templateUrl: './stripe-cc-form.component.html',
  styleUrls: ['./stripe-cc-form.component.css']
})
export class StripeCCFormComponent implements OnInit {
  @Input() stripeFormData: any;
  @Input() small: boolean;
  countries = country_list;

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

  constructor(private fb: FormBuilder) {
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

  checkCCNumber(e) {
    e.preventDefault();
    let input = e.key;
    if (!/^[0-9]+$/.test(input)) { return; }
    if ((this.stripeFormData.cardNumber.length + 1) > 19) { return; }
    this.stripeFormData.cardNumber += input;
  }

  checkCVCNumber(e) {
    e.preventDefault();
    let input = e.key;
    if (!/^[0-9]+$/.test(input)) { return; }
    if ((this.stripeFormData.cvc.length + 1) > 4) { return; }
    this.stripeFormData.cvc += input;
  }
}

interface ValidationResult { [key: string]: boolean; }

class NumberValidator {
  static validate(control: FormControl): ValidationResult {
    if (isBrowser) {
      let stripe = (<any>window).Stripe;
      if (!stripe) { return { 'stripeNotFound': true }; }

      let passStripeValidation = stripe.card.validateCardNumber(control.value);
      if (passStripeValidation) { return null; }
      else { return { 'invalidExpiryDate': true }; }
    }
    else { return null; }
  }
}

class CvcValidator {
  static validate(control: FormControl): ValidationResult {
    if (isBrowser) {
      let stripe = (<any>window).Stripe;
      if (!stripe) { return { 'stripeNotFound': true }; }

      let passStripeValidation = stripe.card.validateCVC(control.value);
      if (passStripeValidation) { return null; }
      else { return { 'invalidExpiryDate': true }; }
    }
    else { return null; }
  }
}
