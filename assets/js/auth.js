
// auth.js - Planner Access + Timeout
(function () {
  const allowedRoles = ["planner"];
  const userRole = localStorage.getItem("role");
  if (!allowedRoles.includes(userRole)) {
    alert("Access denied. Please log in as a planner.");
    window.location.href = "../login.html";
  }

  // Timeout after 15 minutes (900,000 ms)
  let timeout;
  const timeoutDuration = 15 * 60 * 1000;

  function resetTimer() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      alert("Session expired due to inactivity. Please log in again.");
      localStorage.clear();
      window.location.href = "../login.html";
    }, timeoutDuration);
  }

  // Reset on activity
  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeypress = resetTimer;
})();
