import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.component.html',
  styleUrls: ['./select-form.component.css']
})
export class SelectFormComponent implements OnInit {

  ngOnInit(): void {
    this.getColorData();
    this.getTabId();
  }

  constructor( private changeDetector: ChangeDetectorRef) {}

  @Input() title : string = "";

  formSubmittedMessage : boolean = false;

  currentTabId: number = 0;

  colors : string[] = ["red", "blue", "green", "yellow"];

  formatColorTextDisplay(color : string) {
    return color[0].toUpperCase() + color.slice(1); 
  }

  reactiveForm: FormGroup = new FormGroup(
    {
      color: new FormControl(null)
    }
  );

  showDisplayOfSubmittedMessage() {
    this.formSubmittedMessage = true;
    return this.changeDetector.detectChanges();
  }

  removeDisplayOfSubmittedMessage() {
    this.formSubmittedMessage = false;
    return this.changeDetector.detectChanges();
  }

  getColorData() {
    chrome.storage.local.get(['color']).then((result) => {
      if (result['color']) {
        console.log("This is the getColrData method and value currently is " + result['color']);
        this.reactiveForm = new FormGroup(
          {
            color: new FormControl(result['color'])
          }
        );
      } else {
        console.log("This is the getColrData method and no color has been chosen");
      }
      
    });
  }

  getTabId() {
    chrome.tabs.query({ active: true, currentWindow: true})
    .then((tabs) => {
      if(tabs[0].id) {
        return this.currentTabId = tabs[0].id;
      }
      return null
    }).then((result) => {
      console.log("this is the current Tab Id: ", this.currentTabId);
    })
  }

  onSubmit() {

    console.log(this.reactiveForm.value.color);

    chrome.storage.local.set({ 'color': this.reactiveForm.value.color }).then(() => {
      console.log("Value is set to " + this.reactiveForm.value.color);
    });


    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, JSON.stringify(this.reactiveForm.value));
        this.showDisplayOfSubmittedMessage();
        return setTimeout(this.removeDisplayOfSubmittedMessage.bind(this), 1500);
      }
      return null
    })
  }

}
