const form = document.getElementById("forgot-password-form");
const error = document.getElementById("error");

form.addEventListener("submit", forgotPassword);

async function forgotPassword(e) {
    try {
        e.preventDefault();
        const email = e.target.email.value;
        const forgotPasswordDetail = {
            email: email,
        };
        if (!forgotPasswordDetail.email) {
            error.innerHTML = "Enter your email";
            return;
        }
        const res = await axios.post("http://localhost:3000/password/forgot-password", forgotPasswordDetail);
        if (res.status === 200) {
            error.textContent = "";
            document.querySelector("#email").remove();
            document.querySelector("button[type='submit']").remove();
            document.querySelector("h3").innerHTML = `<h3 style='text-align: center;'>We have sent you an email. Please check your email <span style='color: #198754;'>${email}</span> to reset your password.</h3>`
        } else {
            error.textContent = "Email not sent"
        }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            error.textContent = "Email not found";
        } else {
            error.textContent = "An error occurred in sending email";
        }
    }
}