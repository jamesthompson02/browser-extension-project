import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SelectFormComponent } from './components/select-form/select-form.component';
import { BtnComponent } from './components/btn/btn.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './components/header/header.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TestPageComponent } from './pages/test-page/test-page.component';
import { TabPageComponent } from './pages/tab-page/tab-page.component';

@NgModule({
  declarations: [
    AppComponent,
    SelectFormComponent,
    BtnComponent,
    HomePageComponent,
    HeaderComponent,
    SubHeaderComponent,
    TestPageComponent,
    TabPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
