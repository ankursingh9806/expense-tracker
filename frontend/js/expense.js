// shared
document.getElementById("home").addEventListener("click", function () {
    window.location.href = "../html/expense.html";
})

document.getElementById("logo").addEventListener("click", function () {
    window.location.href = "../html/expense.html";
})

document.getElementById("logout-button").addEventListener("click", logout);
document.getElementById("premium").addEventListener("click", showConfirm);

function showConfirm(e) {
    const confirmPurchase = window.confirm("Buy Premium and unlock all the features.");
    if (confirmPurchase) {
        purchasePremium(e);
    }
}

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

// expense
const form = document.getElementById("expense-form");
const error = document.getElementById("error");

document.addEventListener("DOMContentLoaded", function () {
    fetchExpense(1);
});
document.addEventListener("DOMContentLoaded", isPremiumUser);
form.addEventListener("submit", addExpense);

let currentPage = 1;
async function fetchExpense(page = 1) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/expense/expense-fetch?page=${page}`, {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 200) {
            const tableBody = document.getElementById("expense-list");
            tableBody.innerHTML = "";
            res.data.expenses.forEach((expense) => {
                showOnScreen(expense);
            });
            currentPage = page;
            updatePagination(res.data.totalPages);
        } else {
            console.log("failed to load expenses");
        }
    } catch (err) {
        console.error("error in loading expenses:", err);
    }
}

function updatePagination(totalPages) {
    const expenseList = document.getElementById("page-item");
    expenseList.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.classList.add("btn", "btn-secondary", "btn-sm", "mx-1");
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        pageButton.addEventListener('click', () => {
            fetchExpense(i);
        });
        expenseList.appendChild(pageButton);
    }
}

async function addExpense(e) {
    try {
        e.preventDefault();
        const date = e.target.date.value;
        const amount = e.target.amount.value;
        const description = e.target.description.value;
        const category = e.target.category.value;
        const expenseData = {
            date: date,
            amount: amount,
            description: description,
            category: category
        };
        if (!expenseData.date || !expenseData.amount || !expenseData.description || !expenseData.category) {
            error.textContent = "Fill out all fields"
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
            await fetchExpense(currentPage);
            form.reset();
            error.textContent = "";
        } else {
            error.textContent = "Expense not added";
        }
    } catch (err) {
        console.error("error in adding expense:", err);
    }
}

function showOnScreen(expense) {
    const tableBody = document.getElementById("expense-list");
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
    <td>${expense.date}</td>
    <td>${expense.amount}</td>
    <td>${expense.description}</td>
    <td>${expense.category}</td>
    <td>
        <button class="btn btn-secondary btn-sm delete-button">Delete</button>
        <button class="btn btn-secondary btn-sm edit-button">Edit</button>
    </td>`;
    const deleteButton = tableRow.querySelector(".delete-button");
    const editButton = tableRow.querySelector(".edit-button");

    // let expenseId = expense.id;
    let expenseId = expense._id;
    deleteButton.addEventListener("click", function () {
        deleteExpense(expenseId);
    });
    editButton.addEventListener("click", function () {
        editExpense(expense, expenseId);
    });

    tableBody.appendChild(tableRow);
}

async function deleteExpense(expenseId) {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.delete(`http://localhost:3000/expense/expense-delete/${expenseId}`, {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 200) {
            await fetchExpense(currentPage);
        } else {
            error.textContent = "Failed to delete expense. Please try again.";
        }
    } catch (err) {
        console.error("failed to delete expense:", err);
    }
}

async function editExpense(expense, expenseId) {
    try {
        document.getElementById("date").value = expense.date;
        document.getElementById("amount").value = expense.amount;
        document.getElementById("description").value = expense.description;
        document.getElementById("category").value = expense.category;

        document.getElementById("submit-button").textContent = "Update";

        form.removeEventListener("submit", addExpense);
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            await updateExpense(e, expenseId);
        });
    } catch (err) {
        console.error("error in editing expense:", err);
    }
}

async function updateExpense(e, expenseId) {
    try {
        e.preventDefault();
        const updatedDate = e.target.date.value;
        const updatedAmount = e.target.amount.value;
        const updatedDescription = e.target.description.value;
        const updatedCategory = e.target.category.value;

        const updatedExpenseData = {
            date: updatedDate,
            amount: updatedAmount,
            description: updatedDescription,
            category: updatedCategory
        };

        if (!updatedExpenseData.date || !updatedExpenseData.amount || !updatedExpenseData.description || !updatedExpenseData.category) {
            error.textContent = "Fill out all fields"
            return;
        }
        const token = localStorage.getItem("token");
        const res = await axios.put(`http://localhost:3000/expense/expense-update/${expenseId}`, updatedExpenseData, {
            headers: {
                Authorization: token
            }
        });
        if (res.status === 200) {
            await fetchExpense(currentPage);
            form.reset();
            error.textContent = "";
            document.getElementById("submit-button").textContent = "Add Expense";
            form.removeEventListener("submit", updateExpense);
            form.addEventListener("submit", addExpense);
        } else {
            error.textContent = "Failed to update expense";
        }
    } catch (err) {
        console.error("error in updating expense:", err);
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
            alert("Payment failed");
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
            document.getElementById("premium").textContent = "Premium Member 👑";
            document.getElementById("premium").removeEventListener("click", showConfirm);
            document.getElementById("leaderboard").addEventListener("click", function () {
                window.location.href = "../html/leaderboard.html";
            });
            document.getElementById("report").addEventListener("click", function () {
                window.location.href = "../html/report.html";
            })
        } else {
            document.getElementById("leaderboard").addEventListener("click", function (e) {
                alert("Buy Premium and see the leaderboard.");
            });
            document.getElementById("report").addEventListener("click", function (e) {
                alert("Buy Premium and get your report.");
            });
        }
    } catch (err) {
        console.error("error checking premium user status:", err);
    }
}