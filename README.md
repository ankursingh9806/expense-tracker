# Expense Tracker

A simple and secure expense tracker designed to help users manage and track their daily expenses. It includes core features such as adding, deleting, and updating expenses, as well as premium features like leaderboards and detailed expense reports for enhanced financial analysis.

## Features

- **Responsive Design**: Optimized for both mobile and desktop using modern web standards (e.g., HTML5, CSS3, and responsive frameworks).
- **Authentication**: Token-based authentication using JSON Web Token (JWT) to ensure secure access.
- **Sign Up**: Users can register by providing their name, email, and password.
- **Login**: Registered users can log in using their email and password.
- **Password Reset**: Users can reset their password by receiving a reset link via their registered email.
- **Add Expense**: Users can easily add their expenses.
- **Dashboard**: Users can view a summary of the expenses they have added.
- **Edit Expense**: Users can modify their previously added expenses.
- **Delete Expense**: Users can delete any of their expenses.
- **Premium Features**: Unlock premium features like viewing leaderboards and generating reports of their expenses.
- **Leaderboard (Premium)**: Users can view a leaderboard with rankings based on expense data.
- **Reports (Premium)**: Users can view and download daily and monthly reports of their expenses.
- **Logout**: Users can securely log out of the application. Logging back in requires re-entering the password.


## Technology Stack

- **Backend**: Node.js, Express
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap
- **Authentication**: JSON Web Token (JWT)
- **Database**: MySQL with Sequelize ORM, MongoDB with Mongoose ODM (in a separate branch)
- **Cloud Services**: AWS SDK (for downloading reports), AWS (for deployment)
- **Payment**: Razorpay
- **Email Service**: Nodemailer
- **Other Tools**: Axios, Bcrypt, CORS, Dotenv, Helmet, Morgan, UUID

## APIs Used

### Base URL - `http://localhost:3000/`

### User Endpoints

- `GET /user/signup-page` - Retrieves the sign-up page.
- `GET /user/login-page` - Retrieves the login page.
- `POST /user/signup` - Allows users to sign up by providing name, email, and password.
- `POST /user/login` - Logs in users using their email and password.
- `POST /user/logout` - Logs out the current user and invalidates the session.
- `GET /user/is-premium-user` - Checks whether the user is a premium member.

### Password Endpoints

- `GET /password/forgot-password-page` - Retrieves the forgot password page.
- `POST /password/forgot-password` - Sends a password reset link to the user's registered email.
- `GET /password/reset-password-page/:resetId` - Retrieves the reset password page using a unique reset token (UUID `resetId`).
- `POST /password/reset-password/:resetId` - Resets the user's password using the reset token (UUID `resetId`).

### Expense Endpoints

- `GET /expense/expense-fetch` - Retrieves all expenses of the user.
- `POST /expense/expense-add` - Adds a new expense for the user.
- `DELETE /expense/expense-delete/:expenseId` - Deletes a specific expense of the user by expense ID.
- `PUT /expense/expense-update/:expenseId` - Updates a specific expense of the user by expense ID.

### Purchase Endpoints

- `GET /purchase/purchase-premium` - Initiates the purchase process for the premium membership.
- `POST /purchase/update-transaction-status` - Updates the status of the transaction (successful or failed).

### Leaderboard Endpoints

- `GET /premium/leaderboard-show` - Displays the leaderboard with user rankings.

### Report Endpoints

- `POST /premium/daily-report-view` - View the daily expense report.
- `POST /premium/daily-report-download` - Download the daily expense report.
- `POST /premium/monthly-report-view` - View the monthly expense report.
- `POST /premium/monthly-report-download` - Download the monthly expense report.

## Screenshots

### signup page
![signup](/screenshots/01-signup.png)

### login page
![login](/screenshots/02-login.png)

### forgot password page
![forgotPassword](/screenshots/03-forgotPassword.png)

### reset password link send
![resetPasswordLinkSend](/screenshots/04-resetPasswordLinkSend.png)

### reset password link 
![resetPasswordLink](/screenshots/05-resetPasswordLink.png)

### change password 
![changePassword](/screenshots/06-changePassword.png)

### password changed
![passwordChanged](/screenshots/07-passwordChanged.png)

### home
![home](/screenshots/08-home.png)

### add expense
![addExpense](/screenshots/09-addExpense.png)

### pagination
![pagination](/screenshots/10-pagination.png)

### unlock premium
![unlockPremium](/screenshots/11-unlockPremium.png)

### payment
![payment](/screenshots/12-payment.png)

### premium unlocked
![premiumUnlocked](/screenshots/13-premiumUnlocked.png)

### leaderboard
![leaderboard](/screenshots/14-leaderboard.png)

### report
![report](/screenshots/15-report.png)

### report view
![reortView](/screenshots/16-reportView.png)

### report download
![reportDownload](/screenshots/17-reportDownload.png)