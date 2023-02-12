
const checkColorData = async () => {
    const colorData = await chrome.storage.local.get(['color']);
    const result = await colorData['color'];
    if (result) {
        alert("There is some color data stored");
    } else {
        alert("No color data has been saved.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('button').addEventListener('click', checkColorData, false);
   }, false)