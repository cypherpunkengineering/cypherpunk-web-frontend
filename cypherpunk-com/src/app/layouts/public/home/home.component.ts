import { Component } from '@angular/core';
import { SeoService } from '../../../services/seo.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private seo: SeoService) { seo.updateMeta(); }
}
