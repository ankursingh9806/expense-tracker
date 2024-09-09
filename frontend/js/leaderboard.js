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

// leaderboard
document.addEventListener("DOMContentLoaded", leaderboardShow);

async function leaderboardShow() {
    try {
        const res = await axios.get(`http://${ip}:3000/premium/leaderboard-show`);
        if (res.status === 200) {
            let position = 1;
            res.data.userLeaderboard.forEach((users) => {
                showOnScreen(users, position);
                position++;
            });
        } else {
            console.log("failed to load leaderboard");
        }
    } catch (err) {
        console.error("error in loading leaderboard:", err);
    }
}

function showOnScreen(userLeaderboard, position) {
    const tableBody = document.getElementById("table-list");
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `<td>${position}</td><td>${userLeaderboard.name}</td><td>${userLeaderboard.totalExpenses}</td>`;
    tableBody.appendChild(tableRow);
}