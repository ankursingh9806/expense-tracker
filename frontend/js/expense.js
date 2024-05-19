const form = document.getElementById("expense-form");
const tableBody = document.getElementById("expense-list");
const error = document.getElementById("error");
const premiumButton = document.getElementById("premium");
const homeButton = document.getElementById("home");
const logoButton = document.getElementById("logo");
const leaderboardButton = document.getElementById("leaderboard");
const reportButton = document.getElementById("report");
const logoutButton = document.getElementById("logout-button");

document.addEventListener("DOMContentLoaded", fetchExpense);
document.addEventListener("DOMContentLoaded", isPremiumUser);
form.addEventListener("submit", addExpense);
logoutButton.addEventListener("click", logout);
premiumButton.addEventListener("click", showConfirm);

homeButton.addEventListener("click", function () {
    window.location.href = "../html/expense.html";
})

logoButton.addEventListener("click", function () {
    window.location.href = "../html/expense.html";
})

function showConfirm(e) {
    const confirm = window.confirm("Buy Premium and unlock all the features.");
    if (confirm) {
        purchasePremium(e);
    }
};

async function fetchExpense() {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/expense/expense-fetch", {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 200) {
            res.data.expenses.forEach((expense) => {
                showOnScreen(expense);
            });
        } else {
            alert("Failed to load expenses");
        }
    } catch (err) {
        console.error("failed to load expenses from database:", err);
    }
}

async function addExpense(e) {
    try {
        e.preventDefault();
        const amount = e.target.amount.value;
        const description = e.target.description.value;
        const category = e.target.category.value;
        const expenseData = {
            amount: amount,
            description: description,
            category: category
        };
        if (!expenseData.amount || !expenseData.description || !expenseData.category) {
            error.textContent = "Please fill out all fields."
            return;
        }
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:3000/expense/expense-add", expenseData, {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 201) {
            showOnScreen(res.data.newExpense);
            form.reset();
            error.textContent = "";
        } else {
            error.textContent = "Expense not added. Please try again.";
        }
    } catch (err) {
        console.error("failed to save expense to database:", err);
    }
}

function showOnScreen(expense) {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
    <td>${expense.amount}</td>
    <td>${expense.description}</td>
    <td>${expense.category}</td>
    <td>
        <button class="btn btn-success btn-sm">Delete</button>
        <button class="btn btn-success btn-sm">Edit</button>
    </td>`;
    const deleteButton = tableRow.querySelector(".btn.btn-success.btn-sm");
    const editButton = tableRow.querySelector(".btn.btn-success.btn-sm");

    let expenseId = expense.id;
    deleteButton.addEventListener("click", function () {
        deleteExpense(expense, expenseId, tableRow);
    });
    editButton.addEventListener("click", function () {
        updateExpense(expense, expenseId, tableRow);
    });

    tableBody.appendChild(tableRow);
}

async function deleteExpense(expense, expenseId, tableRow) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`http://localhost:3000/expense/expense-delete/${expenseId}`, {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 200) {
            tableBody.removeChild(tableRow);
        } else {
            error.textContent = "Failed to delete expense. Please try again.";
        }
    } catch (err) {
        console.error("failed to delete expense:", err);
    }
}

async function updateExpense(expense, expenseId, tableRow) {
    try {
        document.getElementById("amount").value = expense.amount;
        document.getElementById("description").value = expense.description;
        document.getElementById("category").value = expense.category;

        document.getElementById("submit-button").textContent = "Update";

        form.removeEventListener("submit", addExpense);
        form.addEventListener("submit", editExpenseData);

        async function editExpenseData(e) {
            try {
                e.preventDefault();
                const updatedAmount = e.target.amount.value;
                const updatedDescription = e.target.description.value;
                const updatedCategory = e.target.category.value;

                const updatedExpenseData = {
                    amount: updatedAmount,
                    description: updatedDescription,
                    category: updatedCategory
                };

                if (!updatedExpenseData.amount || !updatedExpenseData.description || !updatedExpenseData.category) {
                    error.textContent = "Please fill out all fields."
                    return;
                }
                const token = localStorage.getItem("token");
                const res = await axios.put(`http://localhost:3000/expense/expense-update/${expenseId}`, updatedExpenseData, {
                    headers: {
                        Authorization: token
                    }
                });
                if (res.status === 200) {
                    expense.amount = updatedAmount;
                    expense.description = updatedDescription;
                    expense.category = updatedCategory;

                    tableRow.innerHTML = `
                        <td>${expense.amount}</td>
                        <td>${expense.description}</td>
                        <td>${expense.category}</td>
                        <td>
                            <button class="btn btn-outline-danger btn-sm">Delete</button>
                            <button class="btn btn-outline-success btn-sm">Edit</button>
                        </td>`;

                    const deleteButton = tableRow.querySelector(".btn.btn-outline-danger.btn-sm");
                    const editButton = tableRow.querySelector(".btn.btn-outline-success.btn-sm");
                    deleteButton.addEventListener("click", function () {
                        deleteExpense(expense, expenseId, tableRow);
                    });
                    editButton.addEventListener("click", function () {
                        updateExpense(expense, expenseId, tableRow);
                    });

                    form.reset();
                    error.textContent = "";
                    document.getElementById("submit-button").textContent = "Add Expense";
                } else {
                    error.textContent = "Failed to update expense. Please try again.";
                }
            } catch (err) {
                console.error("failed to edit expense:", err);
            }
        }
    } catch (err) {
        console.error("failed to update expense:", err);
    }
}

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

async function purchasePremium(e) {
    try {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/purchase/purchase-premium", {
            headers: {
                Authorization: token
            }
        });
        let options = {
            "key": res.data.key_id,
            "order_id": res.data.order.id,
            "handler": async function (response) {
                try {
                    const res = await axios.post("http://localhost:3000/purchase/update-transaction-status", {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id,
                    }, {
                        headers: {
                            Authorization: token
                        }
                    })
                    alert("Welcome to Premium Membership! You've unlocked all the features.");
                    window.location.reload();
                    localStorage.setItem("token", res.data.token);
                } catch (err) {
                    console.err("error updating transaction status:", err);
                    alert("Failed to update transaction status");
                }
            },
        };
        const rzp = new Razorpay(options);
        rzp.open();
        rzp.on("payment.failed", function (response) {
            alert("Payment failed. Please try again.");
        });
    } catch (err) {
        console.error("error purchasing premium membership:", err);
        alert("Failed to purchase premium membership");
    }
}

async function isPremiumUser() {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/user/is-premium-user", {
            headers: {
                Authorization: token
            },
        });
        if (res.data.isPremiumUser) {
            premiumButton.textContent = "Premium Member";
            leaderboardButton.textContent = "LeaderBoard";
            reportButton.textContent = "Report";
            premiumButton.removeEventListener("click", showConfirm);
            leaderboardButton.addEventListener("click", function () {
                window.location.href = "../html/leaderboard.html";
            });
            reportButton.addEventListener("click", function () {
                window.location.href = "../html/report.html";
            })
        } else {
            leaderboardButton.addEventListener("click", showConfirm);
            reportButton.addEventListener("click", showConfirm);
        }
    } catch (err) {
        console.error("error checking premium user status:", err);
    }
}