// chrome.runtime.onInstalled.addListener(() => {
//     chrome.webNavigation.onCompleted.addListener(() => {
//       chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
//         if (id) {
//           chrome.action.disable(id);
//         }
//       });
//     }, { url: [{ hostContains: 'google.com' }] });
//   });


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
      console.log(result['color']);
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
          chrome.tabs.sendMessage(tabId, JSON.stringify("Request Icon"));
          drawImage(urlData[0].color);
          
          
        } else {
          return chrome.action.setIcon({path: "./icon32.png"});
        }

      } else {
        return chrome.action.setIcon({path: "./icon32.png"});
      }
    } else {
      return chrome.action.setIcon({path: "./icon32.png"});
    }
  })
})

const fetchImage = async () => {
  const img = await fetch('icon32.png');
  const blob = await img.blob();
  return blob
}

const getIconImage = async () => {
  const imgBlob = await fetchImage();
  const newBitMapImage = await createImageBitmap(imgBlob);
  return newBitMapImage;
}

const drawImage = async ( color : string) => {
  const offCanvas = new OffscreenCanvas(32,32);
  const newBitMapImage = await getIconImage();
  const context = offCanvas.getContext('2d');
  context!.drawImage(newBitMapImage, 0, 0, 32, 32);
  const imgData : any = context?.getImageData(0,0,32,32);
  console.log(imgData.data);
  if (color === "red") {
    for (let i = 0; i < imgData.data.length; i += 4) {
      const total = imgData.data[i] + imgData.data[i+1] + imgData.data[i+2];
      if (total > 600) {
        imgData.data[i] = 255
        imgData.data[i+1] = 255
        imgData.data[i+2] = 255
        imgData.data[i+3] = 255
      } else {
        imgData.data[i] = 255
        imgData.data[i+1] = 0
        imgData.data[i+2] = 0
      }
    }
    return chrome.action.setIcon({imageData: imgData})

  } else if (color === "blue") {
    for (let i = 0; i < imgData.data.length; i += 4) {
      const total = imgData.data[i] + imgData.data[i+1] + imgData.data[i+2];
      if (total > 600) {
        imgData.data[i] = 255
        imgData.data[i+1] = 255
        imgData.data[i+2] = 255
        imgData.data[i+3] = 255
      } else {
        imgData.data[i] = 0
        imgData.data[i+1] = 0
        imgData.data[i+2] = 255
        
  
      }
    }
    return chrome.action.setIcon({imageData: imgData})

  } else if (color === "green") {
    return chrome.action.setIcon({path: "./icon32.png"})
  } else if (color === "yellow") {
    for (let i = 0; i < imgData.data.length; i += 4) {
      const total = imgData.data[i] + imgData.data[i+1] + imgData.data[i+2];
      if (total > 600) {
        imgData.data[i] = 255
        imgData.data[i+1] = 255
        imgData.data[i+2] = 255
        imgData.data[i+3] = 255
      } else {
        imgData.data[i] = 255
        imgData.data[i+1] = 255
        imgData.data[i+2] = 0
        
  
      }
    }
    return chrome.action.setIcon({imageData: imgData})
  }
  

}


chrome.tabs.onActivated.addListener(( activeInfo ) => {
  chrome.tabs.query({
    active: true, currentWindow: true
  }, (tabs) => {
    chrome.storage.local.get(['color'])
  .then((result) => {
    if (tabs[0].id) {
      if (result['color'].length > 0) {
        const currentTabIdData = result['color'].filter((eachObject : any) => {
          if (eachObject.tabId === tabs[0].id) {
           return eachObject
          }
        })
        if (currentTabIdData.length === 1) {
          const urlData = currentTabIdData[0].data.filter((eachObject: any) => {
            if (eachObject.url === tabs[0].url) {
              return eachObject;
            }
          })
          if (urlData.length === 1) {
            chrome.tabs.sendMessage(tabs[0].id, JSON.stringify(urlData[0]));
            chrome.tabs.sendMessage(tabs[0].id, JSON.stringify("Request Icon"));
            drawImage(urlData[0].color);
            
            
          } else {
            return chrome.action.setIcon({path: "./icon32.png"});
          }
  
          
        } else {
          return chrome.action.setIcon({path: './icon32.png'})
  
        }
  
      } else {
        return chrome.action.setIcon({path: './icon32.png'})
      }

    }

   

  } )
  

})})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.createTab) {
    console.log(message.createTab);
    chrome.tabs.create({
      url: chrome.runtime.getURL('assets/tab-page/tab-page.component.html')
    })
  } else {
    return
  }
  
})


