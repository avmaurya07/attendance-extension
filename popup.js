document.addEventListener("DOMContentLoaded", function () {
    let toggleButton = document.getElementById("toggleButton");

    // Load saved state from Chrome storage
    chrome.storage.sync.get(["attendanceEnabled"], function (data) {
        let isEnabled = data.attendanceEnabled ?? true; // Default: ON
        updateButton(isEnabled);
    });

    toggleButton.addEventListener("click", function () {
        chrome.storage.sync.get(["attendanceEnabled"], function (data) {
            let isEnabled = !data.attendanceEnabled; // Toggle state

            chrome.storage.sync.set({ attendanceEnabled: isEnabled }, function () {
                updateButton(isEnabled);

                // Send message to content script to enable/disable functionality
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (tabs[0]?.id) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: isEnabled ? "enable" : "disable" });
                    }
                });
            });
        });
    });

    function updateButton(isEnabled) {
        // toggleButton.textContent = isEnabled ? "ON" : "OFF";
        // toggleButton.classList.toggle("OFF", !isEnabled);
        toggleButton.checked = isEnabled; // Ensure checkbox reflects the state

    }
});
