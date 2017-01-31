import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  currentTab: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }

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
