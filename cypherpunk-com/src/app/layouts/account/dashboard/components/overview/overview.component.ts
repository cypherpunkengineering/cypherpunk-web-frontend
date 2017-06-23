import { Router } from '@angular/router';
import { Component, Input, ViewChild, NgZone } from '@angular/core';
import { AlertService } from '../../../../../services/alert.service';
import { BackendService } from '../../../../../services/backend.service';
import { PlatformBuilds } from '../../../../public/apps/platform-builds';
import { PlansService, Plan } from '../../../../../services/plans.service';

@Component({
  selector: 'account-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class AccountOverviewComponent {
  @ViewChild('priceBoxes') priceBoxes;
  @Input() state;


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
  planData: {
    plans: Plan[],
    selected: Plan,
    referralCode: string
  } = {
    plans: [],
    selected: undefined,
    referralCode: ''
  };

  // update user info variables
  changeEmailUser = { email: '', password: '' };
  changeEmailErrors = {
    email: { touched: false, exists: false, message: ''},
    password: { touched: false, message: '' }
  };
  changeEmailButtonDisabled: boolean;
  changePasswordUser = { oldPassword: '', newPassword: '' };
  changePasswordErrors = {
    oldPassword: { touched: false, message: '' },
    newPassword: { touched: false, message: '' }
  };
  changePasswordButtonDisabled: boolean;

  constructor(
    private zone: NgZone,
    private router: Router,
    private backend: BackendService,
    private alertService: AlertService
  ) {
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

    // Determine plans to show
    this.backend.pricingPlans('', {})
    .then((plans) => {
      // monthly plan
      this.planData.plans.push({
        id: 'monthly',
        price: Number(plans.monthly.price),
        bcPrice: undefined,
        rate: 'monthly plan',
        months: 1,
        viewable: true,
        bitpayData: plans.monthly.bitpayPlanId,
        paypalButtonId: plans.monthly.paypalPlanId
      });
      // annual plan
      this.planData.plans.push({
        id: 'annually',
        price: Number(plans.annually.price),
        bcPrice: undefined,
        rate: '12 month plan',
        months: 12,
        viewable: true,
        bitpayData: plans.annually.bitpayPlanId,
        paypalButtonId: plans.annually.paypalPlanId
      });
      // semiannual plan
      this.planData.plans.push({
        id: 'semiannually',
        price: Number(plans.semiannually.price),
        bcPrice: undefined,
        rate: '6 month plan',
        months: 6,
        viewable: true,
        bitpayData: plans.semiannually.bitpayPlanId,
        paypalButtonId: plans.semiannually.paypalPlanId
      });
      this.planData.selected = this.planData.plans[1];
      if (this.priceBoxes) { this.priceBoxes.updatePlans(); }
    })
    .catch((err) => {
      console.log('Could not pull pricing plans, defaulting');
      console.log(err);
    });
  }

  pageRedirect(url) { this.router.navigate([url]); }

  showPriceBoxes() {
    let type = this.state.user.account.type;
    let renewal = this.state.user.subscription.renewal;

    if (type === 'free') { return true; }
    else if (type === 'premium') {
      if (renewal !== 'annually' && renewal !== 'forever') { return true;
      }
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
        this.changeEmailButtonDisabled = false;
        this.alertService.success('Your Email was updated');
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
    this.changePasswordErrors.newPassword.touched = true;

    if (!this.changePasswordUser.newPassword) {
      this.changePasswordErrors.newPassword.message = 'Password is Required';
    }
    else if (!this.passwordRegex(this.changePasswordUser.newPassword)) {
      this.changePasswordErrors.newPassword.message = 'Password contains invalid characters';
    }
    else if (this.changePasswordUser.newPassword.length < 6) {
      this.changePasswordErrors.newPassword.message = 'Password must be at least 6 characters';
    }
    else {
      valid = true;
      this.changePasswordErrors.newPassword.message = '';
    }

    return valid;
  }

  validateChangePasswordOld() {
    let valid = false;
    this.changePasswordErrors.oldPassword.touched = true;

    if (!this.changePasswordUser.oldPassword) {
      this.changePasswordErrors.oldPassword.message = 'Password is Required';
    }
    else if (!this.passwordRegex(this.changePasswordUser.oldPassword)) {
      this.changePasswordErrors.oldPassword.message = 'Password contains invalid characters';
    }
    else if (this.changePasswordUser.oldPassword.length < 6) {
      this.changePasswordErrors.oldPassword.message = 'Password must be at least 6 characters';
    }
    else {
      valid = true;
      this.changePasswordErrors.oldPassword.message = '';
    }

    return valid;
  }

  changePassword() {
    let newPassword = this.validateChangePasswordNew();
    let oldPassword = this.validateChangePasswordOld();
    if (!newPassword || !oldPassword || this.changePasswordButtonDisabled) { return; }
    this.changePasswordButtonDisabled = true;

    this.backend.changePassword(this.changePasswordUser, {})
    .then(() => {
      this.zone.run(() => {
        this.changePasswordButtonDisabled = false;
        this.alertService.success('Your Email was updated');
      });
    })
    .catch((err) => {
      this.zone.run(() => {
        this.changePasswordButtonDisabled = false;
        this.alertService.error('Could not update your email: ' + err.message);
      });
    });
  }
}
