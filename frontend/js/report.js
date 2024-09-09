// shared
document.getElementById("home").addEventListener("click", function () {
    window.location.href = "../html/expense.html";
})

document.getElementById("logo").addEventListener("click", function () {
    window.location.href = "../html/expense.html";
})

document.getElementById("leaderboard").addEventListener("click", function () {
    window.location.href = "../html/leaderboard.html";
})

document.getElementById("report").addEventListener("click", function () {
    window.location.href = "../html/report.html";
})

document.getElementById("logout-button").addEventListener("click", logout);

async function logout() {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:3000/user/logout', {}, {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 200) {
            localStorage.removeItem('token');
            window.location.href = '../html/login.html';
        } else {
            console.error('failed to logout');
        }
    } catch (err) {
        console.error('error in logout:', err);
    }
}

const ip = "54.252.112.94";

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
        const date = document.getElementById('date').value;
        const reportData = {
            date: date,
        };
        if (!reportData.date) {
            dailyError.textContent = "Select a date";
            return;
        }
        const token = localStorage.getItem("token");
        const res = await axios.post(`http://${ip}:3000/premium/daily-report-view`, reportData, {
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
            dailyError.textContent = "Daily report not available";
        }
    } catch (err) {
        console.error("error in showing daily report:", err);
    }
}

async function dailyReportDownload(e) {
    try {
        e.preventDefault();
        const date = document.getElementById('date').value;
        const reportData = {
            date: date,
        };
        if (!reportData.date) {
            dailyError.textContent = "Select a date";
            return;
        }
        const token = localStorage.getItem("token");
        const res = await axios.post(`http://${ip}:3000/premium/daily-report-download`, reportData, {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 200) {
            dailyError.textContent = "";
            window.open(res.data.fileUrl);
        } else {
            dailyError.textContent = "Failed to download daily report";
        }
    } catch (err) {
        console.error("error in downloading daily report:", err);
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
        const month = document.getElementById('month').value;
        const reportData = {
            month: month,
        };
        if (!reportData.month) {
            monthlyError.textContent = "Select a month";
            return;
        }
        const token = localStorage.getItem("token");
        const res = await axios.post(`http://${ip}:3000/premium/monthly-report-view`, reportData, {
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
            monthlyError.textContent = "Monthly report not available";
        }
    } catch (err) {
        console.error("error in showing monthly report:", err);
    }
}

async function monthlyReportDownload(e) {
    try {
        e.preventDefault();
        const month = document.getElementById('month').value;
        const reportData = {
            month: month,
        };
        if (!reportData.month) {
            monthlyError.textContent = "Select a month";
            return;
        }
        const token = localStorage.getItem("token");
        const res = await axios.post(`http://${ip}:3000/premium/monthly-report-download`, reportData, {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 200) {
            monthlyError.textContent = "";
            window.open(res.data.fileUrl);
        } else {
            monthlyError.textContent = "Failed to download montyly report";
        }
    } catch (err) {
        console.error("error in downloading monthly report:", err);
    }
}