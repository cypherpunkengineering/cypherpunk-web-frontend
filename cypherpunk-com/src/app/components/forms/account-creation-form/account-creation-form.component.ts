import { Component, Input, OnInit, NgZone } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-account-creation-form',
  templateUrl: './account-creation-form.component.html',
  styleUrls: ['./account-creation-form.component.css']
})
export class AccountCreationFormComponent implements OnInit {
  @Input() accountFormData: any;

  accountForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;

  constructor(
    private zone: NgZone,
    private fb: FormBuilder,
    private backend: BackendService
  ) { }

  ngOnInit() {
    this.accountForm = this.fb.group({
      email: [
        this.accountFormData.email,
        Validators.compose([ Validators.required, EmailValidator.validate])
      ],
      password: [ this.accountFormData.password,
        Validators.compose([Validators.required, PasswordValidator.validate])
      ],
    });

    this.email = this.accountForm.controls['email'];
    this.password = this.accountForm.controls['password'];

    this.accountForm.valueChanges.subscribe((form: any) => {
      if (this.accountForm.disabled) {
        this.accountFormData.form.valid = true;
        return;
      }

      let dirty = this.accountForm.dirty;
      let valid = this.accountForm.valid;
      this.accountFormData.form.valid = dirty && valid;
    });
  }

  disableInputs() {
    this.accountForm.get('email').disable();
    this.accountForm.get('password').disable();
    this.accountFormData.validation.disabled = true;
  }

  validateEmail(): void {
    // check if email is already taken
    let body = { email: this.accountFormData.email };
    this.backend.identifyEmail(body, {})
    .then(() => {
      this.zone.run(() => {
        this.accountFormData.validation.email = false;
        this.accountFormData.validation.warning = true;
      });
    })
    .catch((data) => {
      this.zone.run(() => {
        if (data.status === 401) { this.accountFormData.validation.email = true; }
        else { this.accountFormData.validation.email = false; }
      });
    });
  }
}

interface ValidationResult { [key: string]: boolean; }

class EmailValidator {
  static validate(control: FormControl): ValidationResult {
    // test that email is in right format
    if (!/^\S+@\S+$/.test(control.value)) { return { 'invalidEmailFormat': true }; }
    else { return null; }
  }
}

class PasswordValidator {
  static validate(control: FormControl): ValidationResult {
    // test that email is in right format
    if (!/^[\x21-\x7E]*$/.test(control.value)) { return { 'invalidPasswordFormat': true }; }
    else if (control.value.length < 6) { return { 'invalidPasswordFormat': true }; }
    else { return null; }
  }
}
