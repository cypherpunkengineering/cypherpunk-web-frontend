import { Router } from '@angular/router';
import { Component, Input, ViewChild, NgZone } from '@angular/core';
import { AlertService } from '../../../../../services/alert.service';
import { GlobalsService } from '../../../../../services/globals.service';
import { BackendService } from '../../../../../services/backend.service';
import { PlatformBuilds } from '../../../../public/apps/platform-builds';

@Component({
  selector: 'account-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class AccountOverviewComponent {
  @ViewChild('priceBoxes') priceBoxes;
  @Input() state;

  // env vars
  env: string;

  // platform download links
  windowsDownloadLink: string;
  macosDownloadLink: string;
  linuxDownloadLink: string;
  androidDownloadLink: string;
  iosDownloadLink: string;
  chromeDownloadLink: string;
  firefoxDownloadLink: string;
  windowsRedirectLink: string;
  macosRedirectLink: string;
  linuxRedirectLink: string;

  // upgrade plan variables
  upgrade = true;
  showEmailModal = false;
  showPasswordModal = false;

  // update user info variables
  changeEmailUser = { email: '', password: '' };
  changeEmailErrors = {
    email: { touched: false, exists: false, message: ''},
    password: { touched: false, message: '' }
  };
  changeEmailButtonDisabled: boolean;
  changePasswordUser = { passwordOld: '', passwordNew: '' };
  changePasswordErrors = {
    passwordOld: { touched: false, message: '' },
    passwordNew: { touched: false, message: '' }
  };
  changePasswordButtonDisabled: boolean;

  constructor(
    private zone: NgZone,
    private router: Router,
    private globals: GlobalsService,
    private backend: BackendService,
    private alertService: AlertService
  ) {
    // handle env
    this.env = globals.ENV;

    // handle download and redirect link in platforms section
    this.windowsDownloadLink = PlatformBuilds.windows.link;
    this.macosDownloadLink = PlatformBuilds.macos.link;
    this.linuxDownloadLink = PlatformBuilds.linuxVersions[0].link;
    this.androidDownloadLink = PlatformBuilds['android'].link;
    this.iosDownloadLink = PlatformBuilds['ios'].link;
    this.chromeDownloadLink = PlatformBuilds['chrome'].link;
    this.firefoxDownloadLink = PlatformBuilds['firefox'].link;
    this.windowsRedirectLink = '/apps/windows/download';
    this.macosRedirectLink = '/apps/macos/download';
    this.linuxRedirectLink = '/apps/linux/download';
  }

  pageRedirect(url) { this.router.navigate([url]); }

  handleExpirationType() {
    let user = this.state.user;
    if (user.account.type === 'expired') { return 'expired'; }
    else if (user.account.type === 'premium') {
      if (user.subscription.renews) { return 'renews'; }
      else if (!user.subscription.renews) { return 'expires'; }
    }
    else { return 'none'; }
  }

  handleExpirationOutput() {
    let user = this.state.user;
    let expiration = this.state.user.subscription.expiration;
    if (expiration) {
      let now = new Date();
      let oneDay = 24 * 60 * 60 * 1000;
      let days = Math.ceil(Math.abs((expiration.getTime() - now.getTime()) / (oneDay)));
      return days + ' days';
    }
    return 'loading';
  }

  showPriceBoxes() {
    return false;
    // let accountType = this.state.user.account.type;
    // let subType = this.state.user.subscription.type;
    // let renews = this.state.user.subscription.renews;
    //
    // if (accountType === 'free' || accountType === 'expired') { return true; }
    // else if (accountType === 'premium') {
    //   if (subType === 'forever') { return false; }
    //   if (renews === false) { return true; }
    //   if (subType === 'monthly' || subType === 'semiannually') { return true; }
    // }
    // else { return false; }
  }

  openEmailModal() {
    this.showEmailModal = true;
    setTimeout(() => { document.getElementById('dashboardEmail').focus(); }, 510);
  }

  openPasswordModal() {
    this.showPasswordModal = true;
    setTimeout(() => { document.getElementById('dashboardPassword').focus(); }, 510);
  }

  passwordRegex(password) {
    return /^[\x21-\x7E]*$/.test(password);
  }

  checkEmailExists() {
    // check if email is already taken
    if (!this.changeEmailUser.email) { return; }
    if (!/^\S+@\S+$/.test(this.changeEmailUser.email)) { return; }
    let body = { email: this.changeEmailUser.email };
    this.backend.identifyEmail(body, {})
    .then(() => {
      this.zone.run(() => {
        this.changeEmailErrors.email.exists = true;
        this.changeEmailErrors.email.message = 'This Email already exists';
      });
    })
    .catch((data) => {
      this.zone.run(() => {
        if (data.status === 401) { this.changeEmailErrors.email.exists = false; }
        else { this.changeEmailErrors.email.exists = true; }
      });
    });
  }

  validateEmail() {
    let valid = false;
    this.changeEmailErrors.email.touched = true;

    if (!this.changeEmailUser.email) {
      this.changeEmailErrors.email.message = 'Email is Required';
    }
    else if (!/^\S+@\S+$/.test(this.changeEmailUser.email)) {
      this.changeEmailErrors.email.message = 'Email is not properly formatted';
    }
    else {
      valid = true;
      this.changeEmailErrors.email.message = '';
    }

    return valid;
  }

  validateChangeEmailPassword() {
    let valid = false;
    this.changeEmailErrors.password.touched = true;

    if (!this.changeEmailUser.password) {
      this.changeEmailErrors.password.message = 'Password is Required';
    }
    else if (!this.passwordRegex(this.changeEmailUser.password)) {
      this.changeEmailErrors.password.message = 'Password contains invalid characters';
    }
    else if (this.changeEmailUser.password.length < 6) {
      this.changeEmailErrors.password.message = 'Password must be at least 6 characters';
    }
    else {
      valid = true;
      this.changeEmailErrors.password.message = '';
    }

    return valid;
  }

  changeEmail() {
    this.checkEmailExists();
    let email = this.validateEmail();
    let password = this.validateChangeEmailPassword();
    if (!email || !password || this.changeEmailErrors.email.exists || this.changeEmailButtonDisabled) { return; }
    this.changeEmailButtonDisabled = true;

    this.backend.changeEmail(this.changeEmailUser, {})
    .then(() => {
      this.zone.run(() => {
        this.showEmailModal = false;
        this.changeEmailUser.email = '';
        this.changeEmailUser.password = '';
        this.changeEmailButtonDisabled = false;
        this.alertService.success(`Click on the link in your new email ${this.changeEmailUser.email} to complete the change`);
      });
    })
    .catch((err) => {
      this.zone.run(() => {
        this.changeEmailButtonDisabled = false;
        this.alertService.error('Could not update your email: ' + err.message);
      });
    });
  }

  validateChangePasswordNew() {
    let valid = false;
    this.changePasswordErrors.passwordNew.touched = true;

    if (!this.changePasswordUser.passwordNew) {
      this.changePasswordErrors.passwordNew.message = 'Password is Required';
    }
    else if (!this.passwordRegex(this.changePasswordUser.passwordNew)) {
      this.changePasswordErrors.passwordNew.message = 'Password contains invalid characters';
    }
    else if (this.changePasswordUser.passwordNew.length < 6) {
      this.changePasswordErrors.passwordNew.message = 'Password must be at least 6 characters';
    }
    else {
      valid = true;
      this.changePasswordErrors.passwordNew.message = '';
    }

    return valid;
  }

  validateChangePasswordOld() {
    let valid = false;
    this.changePasswordErrors.passwordOld.touched = true;

    if (!this.changePasswordUser.passwordOld) {
      this.changePasswordErrors.passwordOld.message = 'Password is Required';
    }
    else if (!this.passwordRegex(this.changePasswordUser.passwordOld)) {
      this.changePasswordErrors.passwordOld.message = 'Password contains invalid characters';
    }
    else if (this.changePasswordUser.passwordOld.length < 6) {
      this.changePasswordErrors.passwordOld.message = 'Password must be at least 6 characters';
    }
    else {
      valid = true;
      this.changePasswordErrors.passwordOld.message = '';
    }

    return valid;
  }

  changePassword() {
    let passwordNew = this.validateChangePasswordNew();
    let passwordOld = this.validateChangePasswordOld();
    if (!passwordNew || !passwordOld || this.changePasswordButtonDisabled) { return; }
    this.changePasswordButtonDisabled = true;

    this.backend.changePassword(this.changePasswordUser, {})
    .then(() => {
      this.zone.run(() => {
        this.showPasswordModal = false;
        this.changePasswordUser.passwordNew = '';
        this.changePasswordUser.passwordOld = '';
        this.changePasswordButtonDisabled = false;
        this.alertService.success('Your Password was updated');
      });
    })
    .catch((err) => {
      this.zone.run(() => {
        this.changePasswordButtonDisabled = false;
        this.alertService.error('Could not update your password: ' + err.message);
      });
    });
  }
}
