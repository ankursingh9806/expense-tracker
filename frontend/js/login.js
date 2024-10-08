const form = document.getElementById("login-form");
const error = document.getElementById("error");

form.addEventListener("submit", login);

async function login(e) {
    try {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const loginDetails = {
            email: email,
            password: password
        };
        if (!loginDetails.email || !loginDetails.password) {
            error.textContent = "Fill out all fields";
            return;
        }
        const res = await axios.post("http://localhost:3000/user/login", loginDetails);
        if (res.status === 200) {
            localStorage.setItem("token", res.data.token);
            window.location.href = "../html/expense.html";
        } else {
            error.textContent = "Login failed";
        }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            error.textContent = "Email not found";
        } else if (err.response && err.response.status === 401) {
            error.textContent = "Incorrect password";
        } else {
            error.textContent = "An error occurred during Login";
        }
    }
}