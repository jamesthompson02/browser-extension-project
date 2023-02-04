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
    // Note: chrome.tabs.sendmessage is what you use to send a message from the service worker - or any other part of
    // the extension to the content script.
    // If, however, you wish to send a message from the content script to the service worker - you must use
    // chrome.runtime.sendmessage => make sure you have an onMessage listener added in your service worker to be able
    // to receive the message and do something with the message.
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


chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.get(['color'])
  .then((result) => {
      if( result['color']) {
        let stringifiedArrayOfData = JSON.stringify(result['color']);
        let parsedArrayOfData = JSON.parse(stringifiedArrayOfData);
        const tabData = parsedArrayOfData.filter((eachObject: any) => {
          if (eachObject.tabId === tabId) {
            return eachObject;
          }
        })
        if (tabData.length === 1) {
          const modifiedColorData = parsedArrayOfData.filter((eachObject : any) => {
            if (eachObject.tabId !== tabId) {
              return eachObject
            }
          })
          chrome.storage.local.set({ 'color': modifiedColorData });
        } else {
          return 
        }
      } else {
        return
      }
  })
})

chrome.webNavigation.onCompleted.addListener(({url: url, tabId: tabId}) => {
  chrome.storage.local.get(['color'])
  .then((result) => {
    if (result['color'].length > 0) {
      const currentTabIdData = result['color'].filter((eachObject : any) => {
         if (eachObject.tabId === tabId) {
          return eachObject
         }
      })
      if (currentTabIdData.length === 1) {
        const urlData = currentTabIdData[0].data.filter((eachObject: any) => {
          if (eachObject.url === url) {
            return eachObject;
          }
        })
        if (urlData.length === 1) {
          chrome.tabs.sendMessage(tabId, JSON.stringify(urlData[0]));


        } else {
          return
        }

      } else {
        return
      }
    } else {
      return
    }
  })
})

// chrome.webNavigation.onCommitted.addListener((result) => {
//   console.log(result.transitionType, result.url);
// })
