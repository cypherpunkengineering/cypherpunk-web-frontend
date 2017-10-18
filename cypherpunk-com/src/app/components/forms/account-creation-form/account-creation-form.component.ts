import { Component, Input, OnInit, NgZone } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

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

  emailCheckResults: { [email: string]: boolean; };

  constructor(
    private zone: NgZone,
    private fb: FormBuilder,
    private backend: BackendService
  ) { }

  ngOnInit() {
    this.accountForm = this.fb.group({
      email: [ this.accountFormData.email,
        Validators.compose([Validators.required, EmailValidator.validate])
      ],
      password: [ this.accountFormData.password,
        Validators.compose([Validators.required, PasswordValidator.validate])
      ],
    });
    this.accountFormData.formInstance = this.accountForm;

    this.email = this.accountForm.controls['email'];
    this.password = this.accountForm.controls['password'];

    this.emailCheckResults = {};

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

  enableInputs() {
    this.accountForm.get('email').enable();
    this.accountForm.get('password').enable();
    this.accountFormData.validation.disabled = false;
  }

  disableInputs() {
    this.accountForm.get('email').disable();
    this.accountForm.get('password').disable();
    this.accountFormData.validation.disabled = true;
  }

  validateEmail(): void {
    // check if email is already taken
    let email = this.accountFormData.email;
    if (this.email.invalid || this.emailCheckResults.hasOwnProperty(email)) { return; }
    this.backend.identifyEmail({ email }, {})
    .then(() => {
      this.zone.run(() => {
        this.emailCheckResults[email] = false;
        this.accountFormData.validation.email = false;
        this.accountFormData.validation.warning = true;
      });
    })
    .catch((data) => {
      this.zone.run(() => {
        if (data.status === 401) {
          this.emailCheckResults[email] = true;
          this.accountFormData.validation.email = true;
        } else { this.accountFormData.validation.email = false; }
      });
    });
  }

  measurePasswordStrength(password) : string {
    function getStats(password) {
      let uppercase = 0, lowercase = 0, digits = 0, others = 0;
      let uniqueDict = {}, unique = 0;
      for (let i = 0; i < password.length; i++) {
        const ch = password[i];
        if (uniqueDict.hasOwnProperty(ch)) continue;
        if (ch >= 'A' && ch <= 'Z') uppercase++;
        else if (ch >= 'a' && ch <= 'z') lowercase++;
        else if (ch >= '0' && ch <= '9') digits++;
        else if (ch > ' ' && ch <= '\x7E') others++;
        uniqueDict[ch] = true;
        unique++;
      }
      let classes = +!!uppercase + +!!lowercase + +!!digits + +!!others;
      return { uppercase, lowercase, digits, others, classes, unique };
    }
    function getScoreRequirements(stats) {
      switch (stats.classes) {
        case 4:
          return [6, 8, 12];
        case 3:
          if (stats.others) return [6, 10, 14];
          return [6, 12, 16];
        case 2:
          if (stats.digits || stats.others) return [10, 16, 24];
          return [12, 18];
        case 1:
          if (stats.others) return [10];
          return [14];
      }
      return [];
    }
    function getScore(limits, length) {
      for (let i = limits.length; i > 0; i--) {
        if (length >= limits[i - 1]) return i;
      }
      return 0;
    }

    const stats = getStats(password);
    const limits = getScoreRequirements(stats);
    const length = Math.min(stats.unique * 2, password.length);
    const score = getScore(limits, length);
    return "strength-" + score;
  }
}

class EmailValidator {
  static validate(control: FormControl): ValidationErrors {
    // test that email is in right format
    if (!/^\S+@\S+$/.test(control.value)) { return { 'invalidEmailFormat': true }; }
    else { return null; }
  }
}

class PasswordValidator {
  static validate(control: FormControl): ValidationErrors {
    // test that password is in right format
    if (!/^[\x20-\x7E]*$/.test(control.value)) { return { 'invalidPasswordFormat': true }; }
    else if (control.value.length < 6) { return { 'passwordTooShort': true }; }
    else { return null; }
  }
}
