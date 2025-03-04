// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'changePrimaryColor' && message.color) {
        chrome.storage.local.set({ primaryBackgroundColor: message.color });    // Store primary color
        applyPrimaryBackgroundColor(message.color);
    } else if (message.action === 'changeSecondaryColor' && message.color) {
        chrome.storage.local.set({ secondaryBackgroundColor: message.color });  // Store secondary color
        applySecondaryBackgroundColor(message.color);
    } else if (message.action === 'changeLabelButtonColor' && message.color) {
        chrome.storage.local.set({ labelButtonColor: message.color });          // Store labelButton color
        applyLabelButtonColor(message.color);
    }
});

// Apply stored colors when a new tab is created
chrome.tabs.onCreated.addListener(function(tab) { applyStoredBackgroundColors(tab); });

// Apply stored colors when a tab is updated
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { 
    if (changeInfo.status === 'complete') { applyStoredBackgroundColors(tab); }
});

// Apply primary background color to the current tab
function applyPrimaryBackgroundColor(color) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0]) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (color) => {
                    document.documentElement.style.setProperty('--background', color);
                    document.documentElement.style.setProperty('--foreground', 'white');
                },
                args: [color]
            });
        }
    });
}

// Apply secondary background color to the current tab
function applySecondaryBackgroundColor(color) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0]) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (color) => {
                    // Use regex to extract the RGB components from the hex color string
                    var rgbResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                    document.documentElement.style.setProperty('--background-secondary', `${parseInt(rgbResult[1], 16)} ${parseInt(rgbResult[2], 16)} ${parseInt(rgbResult[3], 16)}`);
                    
                    const secondaryBackground = document.querySelector('.bg-backgroundSecondary');
                    if (secondaryBackground) { secondaryBackground.style.backgroundColor = color; }
                },
                args: [color]
            });
        }
    });
}

// Apply labelButton background color to the current tab
function applyLabelButtonColor(color) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0]) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (color) => {
                    // Use regex to extract the RGB components from the hex color string
                    var rgbResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                    document.documentElement.style.setProperty('--primary-color', `${parseInt(rgbResult[1], 16)} ${parseInt(rgbResult[2], 16)} ${parseInt(rgbResult[3], 16)}`);
                },
                args: [color]
            });
        }
    });
}

// Apply stored colors to a tab when opened or updated
function applyStoredBackgroundColors(tab) {
    chrome.storage.local.get(['primaryBackgroundColor', 'secondaryBackgroundColor', 'labelButtonColor'], function(result) {
        const primaryColor = result.primaryBackgroundColor || '#06070B';
        const secondaryColor = result.secondaryBackgroundColor || '16 17 20';
        const labelButtonColor = result.labelButtonColor || '82 111 255';

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (primary, secondary, labelButton) => {
                // Use regex to extract the RGB components from the hex color string
                var rgbSecResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(secondary);
                var rgbLblBtnResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(labelButton);
                
                document.documentElement.style.setProperty('--background', primary);
                document.documentElement.style.setProperty('--background-secondary', `${parseInt(rgbSecResult[1], 16)} ${parseInt(rgbSecResult[2], 16)} ${parseInt(rgbSecResult[3], 16)}`);
                document.documentElement.style.setProperty('--primary-color', `${parseInt(rgbLblBtnResult[1], 16)} ${parseInt(rgbLblBtnResult[2], 16)} ${parseInt(rgbLblBtnResult[3], 16)}`);
                document.documentElement.style.setProperty('--foreground', 'white');

                const secondaryBackground = document.querySelector('.bg-backgroundSecondary');
                if (secondaryBackground) { secondaryBackground.style.backgroundColor = secondary; }
            },
            args: [primaryColor, secondaryColor, labelButtonColor]
        });
    });
}