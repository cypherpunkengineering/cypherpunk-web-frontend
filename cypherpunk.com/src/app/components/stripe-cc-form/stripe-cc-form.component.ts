import { Component, Input, OnInit } from '@angular/core';
import country_list from '../../layouts/public/pricing/countries';
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
  cvc: AbstractControl;
  country: AbstractControl;
  zipCode: AbstractControl;

  constructor(private fb: FormBuilder) { }

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
      expiryDate: [
        this.stripeFormData.expiryDate,
        Validators.compose([
          Validators.required,
          Validators.maxLength(5),
          ExpiryValidator.validate
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

  expiryOnChange() {
    if (this.stripeFormData.expiryDate && this.stripeFormData.expiryDate.length === 2) {
      this.stripeFormData.expiryDate += '/';
    }
  }
}

interface ValidationResult { [key: string]: boolean; }

class NumberValidator {
  static validate(control: FormControl): ValidationResult {
    let stripe = (<any>window).Stripe;
    if (!stripe) { return { 'stripeNotFound': true }; }

    let passStripeValidation = stripe.card.validateCardNumber(control.value);
    if (passStripeValidation) { return null; }
    else { return { 'invalidExpiryDate': true }; }
  }
}

class ExpiryValidator {
  static validate(control: FormControl): ValidationResult {
    let stripe = (<any>window).Stripe;
    if (!stripe) { return { 'stripeNotFound': true }; }

    let passStripeValidation = stripe.card.validateExpiry(control.value);
    if (passStripeValidation) {
      document.getElementById('cccvc').focus();
      return null;
    }
    else { return { 'invalidExpiryDate': true }; }
  }
}

class CvcValidator {
  static validate(control: FormControl): ValidationResult {
    let stripe = (<any>window).Stripe;
    if (!stripe) { return { 'stripeNotFound': true }; }

    let passStripeValidation = stripe.card.validateCVC(control.value);
    if (passStripeValidation) { return null; }
    else { return { 'invalidExpiryDate': true }; }
  }
}
