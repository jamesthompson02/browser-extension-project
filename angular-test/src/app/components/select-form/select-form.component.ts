import { ThresholdSeverity } from '@angular-devkit/build-angular/src/utils/bundle-calculator';
import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.component.html',
  styleUrls: ['./select-form.component.css']
})
export class SelectFormComponent implements OnInit {

  ngOnInit(): void {
    this.getTabIdAndUrl();
    this.getColorData();
    
  }

  constructor( private changeDetector: ChangeDetectorRef) {}

  @Input() title : string = "";

  formSubmittedMessage : boolean = false;

  currentTabId: number = 0;

  currentURL : string = '';

  colors : string[] = ["red", "blue", "green", "yellow"];

  tabIdsAndColorChoices : Array<any> = [];

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
    console.log("getColorData method has been fired")
    chrome.storage.local.get(['color']).then((result) => {
      if (result['color']) {
        let stringifiedArrayOfData = JSON.stringify(result['color']);
        let parsedArrayOfData = JSON.parse(stringifiedArrayOfData);
        this.tabIdsAndColorChoices = parsedArrayOfData;
        const colorSelected = this.tabIdsAndColorChoices.filter((eachObject) => {
          if (eachObject.tabId === this.currentTabId) {
            return eachObject;
          }
        })
        if (colorSelected.length === 0) {
          this.reactiveForm = new FormGroup(
            {
              color: new FormControl(null)
            }
          );
        } else {
            const colorAndURLDataForSpecificTabId = colorSelected[0].data.filter((eachObject: any) => {
              if (eachObject.url === this.currentURL) {
                return eachObject;
              }
            })
            if (colorAndURLDataForSpecificTabId.length > 0) {
              this.reactiveForm = new FormGroup(
                {
                  color: new FormControl(colorAndURLDataForSpecificTabId[0].color)
                }
              )
              chrome.tabs.sendMessage(this.currentTabId, JSON.stringify(colorAndURLDataForSpecificTabId[0]))
            } else {
              this.reactiveForm = new FormGroup(
                {
                  color: new FormControl(null)
                }
              )
            }
        }    
      } else {
        console.log("This is the getColrData method and no data has been set in chrome storage");
      }
      
    });
  }

  getTabIdAndUrl() {
    chrome.tabs.query({ active: true, currentWindow: true})
    .then((tabs) => {
      if(tabs[0].id && tabs[0].url) {
        this.currentTabId = tabs[0].id;
        return this.currentURL = tabs[0].url;
      }
      return null
    }).then(() => {
      console.log("this is the current Tab Id: ", this.currentTabId);
    })
  }

  onSubmit() {

    console.log('this is the tabIdsAndColorchoices variable in the onsubmit', this.tabIdsAndColorChoices);

    const dataRelatedToCurrentTabId = this.tabIdsAndColorChoices.filter((eachObject: any) => {
      if (eachObject.tabId === this.currentTabId) {
        return eachObject;
      }
    })

    const dataRelatedToAllOtherTabs = this.tabIdsAndColorChoices.filter((eachObject: any) => {
      if (eachObject.tabId !== this.currentTabId) {
        return eachObject;
      }
    })

    const newData = {tabId: this.currentTabId, data: [{color: this.reactiveForm.value.color, url: this.currentURL}]};

    if (dataRelatedToCurrentTabId.length === 1) {
      const removePreExistingColorAndURLDataForThisTabId = dataRelatedToCurrentTabId[0].data.filter((eachColorAndURLEntry: any) => {
              if (eachColorAndURLEntry.url !== this.currentURL) {
                return eachColorAndURLEntry;
              }
      });
      removePreExistingColorAndURLDataForThisTabId.push({color: this.reactiveForm.value.color, url: this.currentURL});
      dataRelatedToAllOtherTabs.push({tabId: this.currentTabId, data: removePreExistingColorAndURLDataForThisTabId});
      this.tabIdsAndColorChoices = dataRelatedToAllOtherTabs;
      console.log("this is the new tabIds variable in the onsubmit: ", this.tabIdsAndColorChoices);
      chrome.storage.local.set({'color': this.tabIdsAndColorChoices });

    } else {
      console.log("there is NO data saved with the current tab id");
      this.tabIdsAndColorChoices.push(newData)
      chrome.storage.local.set({'color': this.tabIdsAndColorChoices });

    }

    

    // if (dataRelatedToCurrentTabId.length === 1) {
    //   console.log("ghis is the datarelatedtocurrenttabid: ", dataRelatedToCurrentTabId[0]);
    //   const removePreExistingColorAndURLDataForThisTabId = dataRelatedToCurrentTabId[0].data.filter((eachColorAndURLEntry: any) => {
    //       if (eachColorAndURLEntry.url !== this.currentURL) {
    //         return eachColorAndURLEntry;
    //       }
    //   })
    //   console.log("this is first time remoepreexisting is logged:", removePreExistingColorAndURLDataForThisTabId);
    //   removePreExistingColorAndURLDataForThisTabId.push({color: this.reactiveForm.value.color, url: this.currentURL});
    //   console.log("this is second time remoepreexisting is logged:", removePreExistingColorAndURLDataForThisTabId);
    //   dataRelatedToCurrentTabId[0]['data'] = removePreExistingColorAndURLDataForThisTabId;



    // } else {
    //   const copyOfTabIdsAndColorChoices = [...this.tabIdsAndColorChoices];
    //   copyOfTabIdsAndColorChoices.push({tabId: this.currentTabId, data: [{color: this.reactiveForm.value.color, url: this.currentURL}]});
    //   chrome.storage.local.set({'color': copyOfTabIdsAndColorChoices});

    // }

    // newData.push({tabId: this.currentTabId, color: this.reactiveForm.value.color, url: this.currentURL});

    // newData.push({tabId: this.currentTabID, data: [{color: this.reactiveForm.value.color, url: this.currentURL}]})

    // chrome.storage.local.set({ 'color': newData }).then(() => {
    //   console.log("Value is set to " + this.reactiveForm.value.color);
    // });


    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0].id) {
        console.log("chrome.tabs.query works");
        chrome.tabs.sendMessage(tabs[0].id, JSON.stringify(this.reactiveForm.value));
        this.showDisplayOfSubmittedMessage();
        return setTimeout(this.removeDisplayOfSubmittedMessage.bind(this), 1500);
      } 
      return console.log("chrome.tabs.query not working ");
      
      
    })
  }

}
