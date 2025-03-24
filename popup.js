document.addEventListener("DOMContentLoaded", function () {
    let toggleButton = document.getElementById("toggleButton");

    // Use chrome.storage or browser.storage based on the browser
    const storage = typeof browser !== "undefined" ? browser.storage : chrome.storage;
    const tabsAPI = typeof browser !== "undefined" ? browser.tabs : chrome.tabs;

    // Load saved state from browser storage
    storage.sync.get(["attendanceEnabled"], function (data) {
        let isEnabled = data.attendanceEnabled ?? true; // Default: ON
        updateButton(isEnabled);
    });

    toggleButton.addEventListener("click", function () {
        storage.sync.get(["attendanceEnabled"], function (data) {
            let isEnabled = !data.attendanceEnabled; // Toggle state

            storage.sync.set({ attendanceEnabled: isEnabled }, function () {
                updateButton(isEnabled);

                // Send message to content script to enable/disable functionality
                tabsAPI.query({ active: true, currentWindow: true }, function (tabs) {
                    if (tabs[0]?.id) {
                        tabsAPI.sendMessage(tabs[0].id, { action: isEnabled ? "enable" : "disable" });
                    }
                });
            });
        });
    });

    function updateButton(isEnabled) {
        toggleButton.checked = isEnabled; // Ensure checkbox reflects the state
    }
});
