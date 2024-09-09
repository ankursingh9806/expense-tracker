const form = document.getElementById("signup-form");
const error = document.getElementById("error");

const ip = "54.252.112.94";

form.addEventListener("submit", signup);

async function signup(e) {
    try {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const signupDetails = {
            name: name,
            email: email,
            password: password
        };
        if (!signupDetails.name || !signupDetails.email || !signupDetails.password) {
            error.textContent = "Fill out all fields";
            return;
        }
        const res = await axios.post(`http://${ip}:3000/user/signup`, signupDetails);
        if (res.status === 201) {
            alert("Signup successfull! Login to continue")
            window.location.href = "../html/login.html";
        } else {
            error.textContent = "Signup failed";
        }
    } catch (err) {
        if (err.response && err.response.status === 409) {
            error.textContent = "Email already exists";
        } else {
            error.textContent = "An error occurred during Signup";
        }
    }
}