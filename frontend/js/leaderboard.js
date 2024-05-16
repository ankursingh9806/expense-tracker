const homeButton = document.getElementById("home");
const logoButton = document.getElementById("logo");
const leaderboardButton = document.getElementById("leaderboard");
const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", logout);
document.addEventListener("DOMContentLoaded", leaderboardShow);

homeButton.addEventListener("click", function () {
    window.location.href = "../html/expense.html";
})

logoButton.addEventListener("click", function () {
    window.location.href = "../html/expense.html";
})

leaderboardButton.addEventListener("click", function () {
    window.location.href = "../html/leaderboard.html";
})

async function logout() {
    try {
        const res = await axios.post("http://localhost:3000/user/logout");
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

async function leaderboardShow() {
    try {
        const res = await axios.get("http://localhost:3000/premium/leaderboard-show");
        if (res.status === 200) {
            res.data.userLeaderboard.forEach((users) => {
                showOnScreen(users);
            });
        } else {
            alert("Failed to load leaderboard");
        }
    } catch (err) {
        console.error("failed to load leaderboard:", err);
    }
}

function showOnScreen(userLeaderboard) {
    const tableBody = document.getElementById("table-list");
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `<td>${userLeaderboard.name}</td><td>${userLeaderboard.totalExpenses}</td>`;
    tableBody.appendChild(tableRow);
}