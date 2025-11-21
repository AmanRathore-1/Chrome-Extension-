// Variables to temporarily store current tab's info
let currentTitle = "";
let currentURL = "";

// Load history when popup opens (on window load)
window.onload = () => {
    loadHistory();
};

// ✔ Fetch current tab title and URL
document.getElementById("getInfo").addEventListener("click", () => {
    // Access active tab in current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        
        // Extract title and URL
        currentTitle = tabs[0].title;
        currentURL = tabs[0].url;

        // Display inside infoBox
        document.getElementById("infoBox").innerHTML = `
            <b>Title:</b> ${currentTitle}<br><br>
            <b>URL:</b><br>${currentURL}
        `;
    });
});

// ✔ Copy title + URL to clipboard
document.getElementById("copyBtn").addEventListener("click", () => {
    
    // Format text for clipboard
    const text = `Title: ${currentTitle}\nURL: ${currentURL}`;

    // Chrome clipboard API
    navigator.clipboard.writeText(text);
    alert("Copied to Clipboard!");
});

// ✔ Save title + URL into Chrome local storage
document.getElementById("saveBtn").addEventListener("click", () => {

    // If no title fetched yet
    if (!currentTitle) {
        alert("Get Tab Info first!");
        return;
    }

    // Create object for this history entry
    const entry = {
        title: currentTitle,
        url: currentURL
    };

    // Get existing history from chrome.storage
    chrome.storage.local.get(["history"], (result) => {
        let history = result.history || [];

        // Add new entry to array
        history.push(entry);

        // Save back to chrome.storage
        chrome.storage.local.set({ history });

        // Reload history UI
        loadHistory();
    });
});

// ✔ Function to load history and show in popup
function loadHistory() {

    chrome.storage.local.get(["history"], (result) => {
        const historyDiv = document.getElementById("history");

        // Clear old display
        historyDiv.innerHTML = "";

        // Get history array from storage
        let history = result.history || [];

        // Loop and print each saved item
        history.forEach((item) => {
            historyDiv.innerHTML += `
                <div class="history-item">
                    <b>${item.title}</b><br>
                    <a href="${item.url}" target="_blank">${item.url}</a>
                </div>
            `;
        });
    });
}
