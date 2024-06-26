import { Component, Input } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { BackendService } from '../../services/backend.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFromComponent {
  @Input() show: { show: false };
  @Input() exitable = true;
  name: string;
  email: string;
  subject: string;
  groupID = '32425127';
  comment: string;

  groups = [
    { value: '32425127', title: 'Customer Support'},
    { value: '33432807', title: 'Billing Question'},
    { value: '42217047', title: 'Leave Feedback'},
    { value: '42228188', title: 'Business Development'},
    { value: '42250028', title: 'Press / Media Inquiries'}
  ];

  nameTouched: boolean;
  nameValid: boolean;
  emailTouched: boolean;
  emailValid: boolean;
  emailRequired: boolean;
  subjectTouched: boolean;
  subjectValid: boolean;
  commentTouched: boolean;
  commentValid: boolean;
  success = false;
  error = false;

  constructor(
    private alerts: AlertService,
    private backend: BackendService,
    private session: SessionService
  ) {
    if (session.user.account.email) {
      this.email = session.user.account.email;
      this.emailTouched = true;
      this.emailRequired = true;
      this.emailValid = true;
    }
  }

  validateName() {
    if (!this.name) { this.nameValid = false; }
    else { this.nameValid = true; }
  }

  validateEmail() {
    if (!this.email) { this.emailRequired = false; }
    else { this.emailRequired = true; }

    if (!/^\S+@\S+$/.test(this.email)) { this.emailValid = false; }
    else { this.emailValid = true; }
  }

  validateSubject() {
    if (!this.subject) { this.subjectValid = false; }
    else { this.subjectValid = true; }
  }

  validateComment() {
    if (!this.comment) { this.commentValid = false; }
    else { this.commentValid = true; }
  }

  send() {
    this.nameTouched = true;
    this.emailTouched = true;
    this.subjectTouched = true;
    this.commentTouched = true;
    if (!this.nameTouched ||
        !this.nameValid ||
        !this.emailTouched ||
        !this.emailValid ||
        !this.emailRequired ||
        !this.subjectTouched ||
        !this.subjectValid ||
        !this.commentTouched ||
        !this.commentValid) { return; }

    let body = {
      name: this.name,
      email: this.email,
      subject: this.subject,
      groupID: this.groupID,
      comment: this.comment
    };

    this.backend.contactForm(body)
    .then((data) => {
      this.show['show'] = false;
      this.alerts.success('Thank you for your submission. <br><br>One of our cypherpunks will be in touch shortly!!');
      this.name = '';
      this.subject = '';
      this.groupID = '32425127';
      this.comment = '';
    })
    .catch((err) => {
      this.error = true;
      console.log(err);
    });
  }

  close() { this.show['show'] = false; }
}
