import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  currentTab: string;
  showContactForm = { show: false };

  constructor(
    private seo: SeoService,
    private location: Location,
    private route: ActivatedRoute
  ) {
    seo.updateMeta({
      title: 'Submit Feedback About Cypherpunk Privacy',
      description: 'Help us improve our privacy service by submitting feedback about your experience.',
      url: '/feedback'
    });
  }

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
}
