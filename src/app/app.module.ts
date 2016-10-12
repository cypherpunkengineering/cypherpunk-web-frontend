import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { RootComponent } from './app-root.component';
import { HomeComponent } from './layouts/public/home/home.component';
import { DownloadComponent } from './layouts/public/download/download.component';
import { NotFoundComponent } from './layouts/404/404.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  // all components must be declared here
  declarations: [
    RootComponent,
    HomeComponent,
    DownloadComponent,
    NotFoundComponent,
    NavigationComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
