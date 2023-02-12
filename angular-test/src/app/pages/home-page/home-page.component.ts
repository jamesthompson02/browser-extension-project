import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  createTab() : void {
    chrome.runtime.sendMessage({createTab: "Create a tab for the results"})
  }
 
}
