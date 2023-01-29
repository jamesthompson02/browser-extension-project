
console.log("chrome extension content script is firing");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    return true
})