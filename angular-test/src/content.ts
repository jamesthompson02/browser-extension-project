
console.log("chrome extension content script is firing");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message', message);
    console.log('sender', sender);
    return true
})

// Note, console logging the sender simply returns an object with 2 keys: 
// 1) an id key which will be the id of your browser extension
// 2) an origin key
// This applies when sending a message from a component inside the popup window too - not just from the background script.