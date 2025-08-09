<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FSM Login</title>
    <link rel="stylesheet" href="assets/css/style.css"> <!-- Optional external CSS -->
    <style>
        body {
            background-color: #f5f7fa;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .login-container {
            background: #fff;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
            width: 350px;
        }
        h2 {
            margin-bottom: 1rem;
            text-align: center;
            color: #003366;
        }
        label {
            font-weight: bold;
            margin-top: 10px;
            display: block;
            color: #333;
        }
        input[type="email"],
        input[type="password"] {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
        .remember-forgot {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 0.9em;
        }
        button {
            width: 100%;
            padding: 10px;
            background: #003366;
            color: white;
            border: none;
            border-radius: 5px;
            margin-top: 15px;
            cursor: pointer;
            font-size: 1em;
        }
        button:hover {
            background: #0055a5;
        }
        .error {
            color: red;
            text-align: center;
            margin-top: 10px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h2>Sign in</h2>
        <form id="loginForm">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required>

            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" required>

            <div class="remember-forgot">
                <label>
                    <input type="checkbox" id="remember"> Remember
                </label>
                <a href="#">Forgot?</a>
            </div>

            <button type="submit">Log in</button>
            <div id="error-message" class="error"></div>
        </form>
    </div>

    <!-- Auth JS -->
    <script src="assets/js/auth.js"></script>
</body>
</html>
