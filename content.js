chrome.storage.sync.get(["attendanceEnabled"], function (data) {
    if (data.attendanceEnabled) {
        runAttendanceScript(); 
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "enable") {
        runAttendanceScript();
    } else if (message.action === "disable") {
        location.reload(); 
    }
});

function runAttendanceScript() {
    console.log("Attendance script running...");

    let tableBody = document.querySelector("#table1 tbody");
    if (!tableBody) {
        console.error("Attendance table not found!");
        return;
    }

    let tableRows = tableBody.querySelectorAll("tr");

    // let headerRow = document.querySelector("#table1 thead tr tr");
    let headerRow = document.querySelector("#table1 thead tr:nth-of-type(2)");
    if (headerRow && !headerRow.querySelector(".canSkipHeader")) {
        let skipHeader = document.createElement("th");
        skipHeader.textContent = "Can Skip";
        skipHeader.classList.add("canSkipHeader");
        headerRow.appendChild(skipHeader);

        let attendHeader = document.createElement("th");
        attendHeader.textContent = "Need to Attend";
        attendHeader.classList.add("attendHeader");
        headerRow.appendChild(attendHeader);
    }

    tableRows.forEach((row) => {
        let cols = row.querySelectorAll("td");
        if (cols.length < 9) return;

        let delivered = parseInt(cols[6].innerText.trim(), 10);
        let attended = parseInt(cols[7].innerText.trim(), 10);

        let percentage = (attended / delivered) * 100;
        let extraLecturesToSkip = 0;
        let extraLecturesToAttend = 0;

        let tempDelivered = delivered;
        let tempAttended = attended;

        if (percentage >= 75) {
            while (((tempAttended / (tempDelivered + 1)) * 100) >= 75) {
                tempDelivered++;
                extraLecturesToSkip++;
            }
        } else {
            while ((tempAttended / tempDelivered) * 100 < 75) {
                tempAttended++;
                tempDelivered++;
                extraLecturesToAttend++;
            }
        }

        let skipCell = document.createElement("td");
        let attendCell = document.createElement("td");

        skipCell.textContent = extraLecturesToSkip || "-";
        skipCell.style.color = "green";

        attendCell.textContent = extraLecturesToAttend || "-";
        attendCell.style.color = "red";

        row.appendChild(skipCell);
        row.appendChild(attendCell);
    });

    console.log("Attendance data updated successfully!");
}
