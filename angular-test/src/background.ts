chrome.runtime.onInstalled.addListener(() => {
    chrome.webNavigation.onCompleted.addListener(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
        if (id) {
          chrome.action.disable(id);
        }
      });
    }, { url: [{ hostContains: 'google.com' }] });
  });


// this youtube function basically does the following:
// when the user moves to a new webpage, check if the user has gone to youtube.
// if they have, send info to the content script about the tab the user is currently on which is looking at youtube.
// if they have not, do nothing.

chrome.webNavigation.onCompleted.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
            return chrome.tabs.sendMessage(tabs[0].id, JSON.stringify(tabs[0]));
        }
        return null    
    });
}, { url: [{ hostContains: 'youtube.com' }] });

// sample response that this youtube function will send to content script:
// {"active":true,
// "audible":false,
// "autoDiscardable":true,"discarded":false,
// "favIconUrl":"https://www.youtube.com/s/desktop/d8e1215c/img/favicon_32x32.png",
// "groupId":-1,"height":688,"highlighted":true,"id":1106586703,
// "incognito":false,"index":17,"mutedInfo":{"muted":false},"pinned":false,
// "selected":true,"status":"loading",
// "title":"YouTube","url":"https://www.youtube.com/",
// "width":676,"windowId":1103564772}





// The following is a test to see if data can be passed from the popup window 
