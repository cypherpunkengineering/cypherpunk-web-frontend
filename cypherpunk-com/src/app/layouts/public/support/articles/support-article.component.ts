import { Location } from '@angular/common';
import { isBrowser } from 'angular2-universal';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { BackendService } from '../../../../services/backend.service';
import { SharedModule } from '../../../../components/shared/shared.module';
import { Component, Inject, OnInit, OnDestroy, AfterViewChecked, Compiler, NgModule, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  templateUrl: './support-article.component.html',
  styleUrls: ['./support-article.component.css']
})
export class SupportArticleComponent implements OnInit, AfterViewChecked, OnDestroy {
  // @ViewChild('support', { read: ViewContainerRef }) support: ViewContainerRef;
  contentLoaded: boolean = false;
  pageLinks = [];
  baseRoute: String;
  post = {
    id: '',
    title: '',
    labels: [],
    content: '',
    published: '',
    images: [ { url: '' } ]
  };

  constructor(
    private compiler: Compiler,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private backend: BackendService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.baseRoute = location.path();
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    if (!id) { return this.router.navigate(['/']); }
    else {
      if (isBrowser) {
        console.log('in browser');
        this.backend.supportPost(id)
        .then((data) => {
          // data.content = data.content.replace(/__CYPHERPUNK_OPENVPN_HOSTNAME_SELECTOR__/g, '<app-setup-hostname [(location)]="componentLocation"></app-setup-hostname>');
          this.post = data;
          this.document.title = data.title;
          console.log(this.post);
          // this.addComponent(data.content);
        })
        .catch((err) => {
          console.log(err);
          this.router.navigate(['/support']);
        });
      }
    }
  }

  ngAfterViewChecked() {
    if (this.contentLoaded) { return; }
    if (isBrowser) {
      // get all h3 tags
      let elements = document.querySelectorAll('h3');
      if (elements.length) { this.contentLoaded = true; }
      for (let i = 0; i < elements.length; i++) {
        // create id hash
        let title = elements[i].textContent;
        let text = title.toLowerCase();
        text = text.trim();
        text = text.replace(/ /g, '-');
        let hash = text + '-' + i;

        // bind id to child element
        let span = document.createElement('span');
        span.id = hash;
        span.className = 'features-anchor-target';
        elements[i].appendChild(span);

        // save hash for displaying later
        setTimeout(() => {
          this.pageLinks.push({ 'title': title, hash: hash});
        });
      }
    }
  }

  ngOnDestroy() {
    this.document.title = 'Cypherpunk Privacy | Online Privacy &amp; Freedom Made Easy';
  }

  private addComponent(template: string) {
    console.log('creating component');
    @Component({template: '<div class="support content">' + template + '</div>'})
    class TemplateComponent {
      componentLocation = { hostname: '', display: true };
    }

    console.log('creating module');

    @NgModule({imports: [SharedModule], declarations: [TemplateComponent]})
    class TemplateModule {}


    console.log('compiling');
    const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
    console.log('factorizing');
    const factory = mod.componentFactories.find((comp) =>
      comp.componentType === TemplateComponent
    );
    console.log('creating component');
    // this.support.createComponent(factory);
  }

}
