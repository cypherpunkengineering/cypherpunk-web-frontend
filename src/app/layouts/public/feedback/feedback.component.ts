import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  currentTab: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    let fragment = this.route.snapshot.fragment;
    this.currentTab = fragment || 'survey';
  }

  showSurvey() {
    document.getElementById('survey').style.display = 'block';
    document.getElementById('survey-button').style.display = 'none';
  }

  openFeedback() {
    let ze = (<any>window).zE;
    ze.activate({hideOnClose: true});
  }

}
