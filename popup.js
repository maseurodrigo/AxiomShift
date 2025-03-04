document.addEventListener('DOMContentLoaded', function() {
    // Load stored colors when popup opens
    chrome.storage.local.get(['primaryBackgroundColor', 'secondaryBackgroundColor', 'labelButtonColor'], function(result) {
        if (result.primaryBackgroundColor) document.getElementById('primaryColorPicker').value = result.primaryBackgroundColor;
        if (result.secondaryBackgroundColor) document.getElementById('secondaryColorPicker').value = result.secondaryBackgroundColor;
        if (result.labelButtonColor) document.getElementById('labelButtonColorPicker').value = result.labelButtonColor;
    });
});

document.getElementById('primaryColorPicker').addEventListener('input', function(event) {
    const color = event.target.value;
    
    // Save the primary color to chrome storage
    chrome.storage.local.set({ primaryBackgroundColor: color });
    
    // Send the color to the background service worker
    chrome.runtime.sendMessage({ action: 'changePrimaryColor', color: color });
});

document.getElementById('secondaryColorPicker').addEventListener('input', function(event) {
    const color = event.target.value;
    
    // Save the secondary color to chrome storage
    chrome.storage.local.set({ secondaryBackgroundColor: color });
    
    // Send the color to the background service worker
    chrome.runtime.sendMessage({ action: 'changeSecondaryColor', color: color });
});

document.getElementById('labelButtonColorPicker').addEventListener('input', function(event) {
    const color = event.target.value;

    // Save the labelButton color to chrome storage
    chrome.storage.local.set({ labelButtonColor: color });

    // Send the color to the background service worker
    chrome.runtime.sendMessage({ action: 'changeLabelButtonColor', color: color });
});