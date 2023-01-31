import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.component.html',
  styleUrls: ['./select-form.component.css']
})
export class SelectFormComponent {

  constructor( private changeDetector: ChangeDetectorRef) {}

  @Input() title : string = "";

  formSubmittedMessage : boolean = false;

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

  onSubmit() {
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
