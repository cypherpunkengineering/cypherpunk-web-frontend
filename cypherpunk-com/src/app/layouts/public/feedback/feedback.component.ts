import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject, OnInit } from '@angular/core';


@Component({
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  currentTab: string;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Submit Feedback About Cypherpunk Privacy'; }

  ngOnInit() {
    let fragment = this.route.snapshot.fragment;
    this.currentTab = fragment || 'survey';
  }

  updateLocation(fragment: string) {
    this.currentTab = fragment;
    this.location.go('/feedback#' + fragment);
  }

  showSurvey() {
    document.getElementById('survey').style.display = 'block';
    document.getElementById('survey-button').style.display = 'none';
  }

  showVote() {
    document.getElementById('vote').style.display = 'block';
    document.getElementById('vote-button').style.display = 'none';
  }

  openFeedback() {
    let ze = (<any>window).zE;
    ze.activate({hideOnClose: true});
  }

}
