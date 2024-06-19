const homeButton = document.getElementById("home");
const logoButton = document.getElementById("logo");
const leaderboardButton = document.getElementById("leaderboard");
const reportButton = document.getElementById("report");
const logoutButton = document.getElementById("logout-button");

const ip = "3.25.84.40";

logoutButton.addEventListener("click", logout);

homeButton.addEventListener("click", function () {
    window.location.href = "../html/expense.html";
})

logoButton.addEventListener("click", function () {
    window.location.href = "../html/expense.html";
})

leaderboardButton.addEventListener("click", function () {
    window.location.href = "../html/leaderboard.html";
})

reportButton.addEventListener("click", function () {
    window.location.href = "../html/report.html";
})

async function logout() {
    try {
        const res = await axios.post("http://${ip}:3000/user/logout");
        if (res.status === 200) {
            localStorage.removeItem("token");
            window.location.href = "../html/login.html";
        } else {
            alert("Failed to logout");
        }
    } catch (err) {
        console.error("failed to logout:", err);
    }
}

// daily report
const dailyError = document.getElementById("daily-error");
const dailyViewButton = document.getElementById("daily-view-button");
const dailyDownloadButton = document.getElementById("daily-download-button");
dailyViewButton.addEventListener("click", dailyReportView);
dailyDownloadButton.addEventListener("click", async function (e) {
    await dailyReportDownload(e);
});

async function dailyReportView(e) {
    try {
        e.preventDefault();
        const dateInput = document.getElementById("date");
        if (!dateInput.value) {
            dailyError.textContent = "Please select a date.";
            return;
        }
        const reportData = {
            date: dateInput.value,
        };
        const token = localStorage.getItem("token");
        const res = await axios.post("http://${ip}:3000/premium/daily-report-view", reportData, {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 200) {
            const expenses = res.data.expenses;
            const tableBody = document.getElementById("daily-report-list");
            const totalAmountElement = document.getElementById("daily-total-amount");
            tableBody.innerHTML = "";
            let totalAmount = 0;
            expenses.forEach(expense => {
                const tableRow = document.createElement("tr");
                tableRow.innerHTML = `
                <td>${expense.date}</td>
                <td>${expense.amount}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>`;
                tableBody.appendChild(tableRow);
                totalAmount += expense.amount;
            });
            totalAmountElement.textContent = `Total = ${totalAmount}`;
            dailyError.textContent = "";
        } else {
            dailyError.textContent = "Report not available. Please try again.";
        }
    } catch (err) {
        console.error("failed to show daily report:", err);
    }
}

async function dailyReportDownload(e) {
    try {
        e.preventDefault();
        const dateInput = document.getElementById("date");
        if (!dateInput.value) {
            dailyError.textContent = "Please select a date.";
            return;
        }
        const reportData = {
            date: dateInput.value,
        };
        const token = localStorage.getItem("token");
        const res = await axios.post("http://${ip}:3000/premium/daily-report-download", reportData, {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 200) {
            dailyError.textContent = "";
            window.open(res.data.fileUrl);
        } else {
            dailyError.textContent = "Failed to download report. Please try again.";
        }
    } catch (err) {
        console.error("failed to download daily report:", err);
    }
}

// monthly report
const monthlyError = document.getElementById("monthly-error");
const monthlyViewButton = document.getElementById("monthly-view-button");
const monthlyDownloadButton = document.getElementById("monthly-download-button");
monthlyViewButton.addEventListener("click", monthlyReportView);
monthlyDownloadButton.addEventListener("click", async function (e) {
    await monthlyReportDownload(e);
});

async function monthlyReportView(e) {
    try {
        e.preventDefault();
        const dateInput = document.getElementById("month");
        if (!dateInput.value) {
            monthlyError.textContent = "Please select a month.";
            return;
        }
        const reportData = {
            month: dateInput.value,
        };
        console.log(reportData);
        const token = localStorage.getItem("token");
        const res = await axios.post("http://${ip}:3000/premium/monthly-report-view", reportData, {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 200) {
            const expenses = res.data.expenses;
            const tableBody = document.getElementById("monthly-report-list");
            const totalAmountElement = document.getElementById("monthly-total-amount");
            tableBody.innerHTML = "";
            let totalAmount = 0;
            expenses.forEach(expense => {
                const tableRow = document.createElement("tr");
                tableRow.innerHTML = `
                <td>${expense.date}</td>
                <td>${expense.amount}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>`;
                tableBody.appendChild(tableRow);
                totalAmount += expense.amount;
            });
            totalAmountElement.textContent = `Total = ${totalAmount}`;
            monthlyError.textContent = "";
        } else {
            monthlyError.textContent = "Report not available. Please try again.";
        }
    } catch (err) {
        console.error("failed to show monthly report:", err);
    }
}

async function monthlyReportDownload(e) {
    try {
        e.preventDefault();
        const dateInput = document.getElementById("month");
        if (!dateInput.value) {
            monthlyError.textContent = "Please select a month.";
            return;
        }
        const reportData = {
            month: dateInput.value,
        };
        const token = localStorage.getItem("token");
        const res = await axios.post("http://${ip}:3000/premium/monthly-report-download", reportData, {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 200) {
            monthlyError.textContent = "";
            window.open(res.data.fileUrl);
        } else {
            monthlyError.textContent = "Failed to download report. Please try again.";
        }
    } catch (err) {
        console.error("failed to download monthly report:", err);
    }
}