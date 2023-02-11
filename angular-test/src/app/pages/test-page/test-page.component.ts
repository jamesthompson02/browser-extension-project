import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})
export class TestPageComponent {
  constructor( private location: Location) {}

  goBack() : void {
    this.location.back();
  }

}
