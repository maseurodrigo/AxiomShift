// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'changePrimaryColor' && message.color) {
        chrome.storage.local.set({ primaryBackgroundColor: message.color }); // Store primary color
        applyPrimaryBackgroundColor(message.color);
    } else if (message.action === 'changeSecondaryColor' && message.color) {
        chrome.storage.local.set({ secondaryBackgroundColor: message.color }); // Store secondary color
        applySecondaryBackgroundColor(message.color);
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
                    const secondaryBackground = document.querySelector('.bg-backgroundSecondary');
                    if (secondaryBackground) {
                        document.documentElement.style.setProperty('--background-secondary', 'transparent');
                        secondaryBackground.style.backgroundColor = color;
                    }
                },
                args: [color]
            });
        }
    });
}

// Apply stored colors to a tab when opened or updated
function applyStoredBackgroundColors(tab) {
    chrome.storage.local.get(['primaryBackgroundColor', 'secondaryBackgroundColor'], function(result) {
        const primaryColor = result.primaryBackgroundColor || '#06070B';
        const secondaryColor = result.secondaryBackgroundColor || 'transparent';
        
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (primary, secondary) => {
                document.documentElement.style.setProperty('--background', primary);
                document.documentElement.style.setProperty('--foreground', 'white');
                
                const secondaryBackground = document.querySelector('.bg-backgroundSecondary');
                if (secondaryBackground) {
                    document.documentElement.style.setProperty('--background-secondary', 'transparent');
                    secondaryBackground.style.backgroundColor = secondary;
                }
            },
            args: [primaryColor, secondaryColor]
        });
    });
}