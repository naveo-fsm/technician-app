// auth.js

const API_URL = "https://api.nocodb.com"; // Replace with your NocoDB URL if self-hosted
const BASE_ID = "navegeo33"; // If using cloud, you can skip this, else set your base slug
const TABLE_ID_USERS = "mes51s7dmb2mewm"; // users table ID
const PAT = "7x7ZxLedCtJSWtiD4dNOu9sB7JlEFB8JiVe0TpRh"; // Your Personal Access Token

async function loginUser(email, password) {
    try {
        // Fetch user from NocoDB
        const res = await fetch(`${API_URL}/api/v2/tables/${TABLE_ID_USERS}/records`, {
            method: "GET",
            headers: {
                "xc-token": PAT,
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        if (!data.list) {
            throw new Error("Invalid response from server");
        }

        // Find matching user
        const user = data.list.find(u => 
            u.email_address?.toLowerCase() === email.toLowerCase() && 
            u.password === password &&
            u.status?.toLowerCase() === "active"
        );

        if (!user) {
            alert("Invalid email, password, or inactive account.");
            return false;
        }

        // Save user session
        localStorage.setItem("loggedInUser", JSON.stringify({
            id: user.id,
            email: user.email_address,
            role: user.user_role,
            name: user.full_name || "",
            phone: user.phone || ""
        }));

        // Redirect based on role
        if (user.user_role === "Planner") {
            window.location.href = "planner/planner.html";
        } else if (user.user_role === "Technician") {
            window.location.href = "technician/technician.html";
        } else {
            window.location.href = "index.html";
        }

        return true;

    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed. Please try again.");
        return false;
    }
}

// Attach to form
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.querySelector("input[type='email']").value;
            const password = document.querySelector("input[type='password']").value;
            await loginUser(email, password);
        });
    }
});
