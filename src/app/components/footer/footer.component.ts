import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  zendeskToken: string = '';
  showFeedbackModal: boolean = false;
  validName: boolean = false;
  validEmail: boolean = false;
  validMessage: boolean = false;
  nameTouched: boolean = false;
  emailTouched: boolean = false;
  messageTouched: boolean = false;
  feedbackButtonDisabled: boolean = false;

  name: string = '';
  email: string = '';
  message: string = '';

  openFeedbackModal() {
    this.showFeedbackModal = true;
    setTimeout(() => {
      document.getElementById('feedbackName').focus();
    }, 100);
  }

  closeFeedbackModal() {
    this.showFeedbackModal = false;
    this.name = '';
    this.email = '';
    this.message = '';
    this.validName = false;
    this.validEmail = false;
    this.validMessage = false;
    this.nameTouched = false;
    this.emailTouched = false;
    this.messageTouched = false;
  }

  validateName() {
    this.nameTouched = true;
    if (!this.name) { this.validName = false; }
    else { this.validName = true; }
    return this.validName;
  }

  validateEmail() {
    this.emailTouched = true;

    if (!this.email) { this.validEmail = false; }
    else if (!/^\S+@\S+$/.test(this.email)) { this.validEmail = false; }
    else { this.validEmail = true; }
    return this.validEmail;
  }

  validateMessage() {
    this.messageTouched = true;
    if (!this.message) { this.validMessage = false; }
    else { this.validMessage = true; }
    return this.validMessage;
  }

  validateFeedback() {
    return this.validName && this.emailTouched &&
    this.validName && this.nameTouched &&
    this.validMessage && this.messageTouched;
  }

  sendFeedback() {
    this.feedbackButtonDisabled = true;


    this.feedbackButtonDisabled = false;
  }

}
