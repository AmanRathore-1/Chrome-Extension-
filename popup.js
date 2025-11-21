let currentTitle = "";
let currentURL = "";

// Load History on Startup
window.onload = () => {
    loadHistory();
};

// Get Title + URL
document.getElementById("getInfo").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        currentTitle = tabs[0].title;
        currentURL = tabs[0].url;

        document.getElementById("infoBox").innerHTML = `
            <b>Title:</b> ${currentTitle}<br><br>
            <b>URL:</b><br>${currentURL}
        `;
    });
});

// Copy to Clipboard
document.getElementById("copyBtn").addEventListener("click", () => {
    const text = `Title: ${currentTitle}\nURL: ${currentURL}`;
    navigator.clipboard.writeText(text);
    alert("Copied to Clipboard!");
});

// Save to localStorage
document.getElementById("saveBtn").addEventListener("click", () => {
    if (!currentTitle) {
        alert("Get Tab Info first!");
        return;
    }

    const entry = { title: currentTitle, url: currentURL };

    chrome.storage.local.get(["history"], (result) => {
        let history = result.history || [];
        history.push(entry);

        chrome.storage.local.set({ history });
        loadHistory();
    });
});

// Load and Display History
function loadHistory() {
    chrome.storage.local.get(["history"], (result) => {
        const historyDiv = document.getElementById("history");
        historyDiv.innerHTML = "";

        let history = result.history || [];

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
