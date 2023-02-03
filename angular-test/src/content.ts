
console.log("chrome extension content script is firing");


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const colors: string[] = ["red", "blue", "green", "yellow"]
    const parsedMessage = JSON.parse(message);
    console.log('message', message);
    console.log('sender', sender);
    console.log("this is parsedMessage: ", parsedMessage);
    if (parsedMessage.color && colors.includes(parsedMessage.color)) {
        const body = document.body;
        return body.style.backgroundColor = parsedMessage.color;
    }
    return true
})

// Note, console logging the sender simply returns an object with 2 keys: 
// 1) an id key which will be the id of your browser extension
// 2) an origin key
// This applies when sending a message from a component inside the popup window too - not just from the background script.