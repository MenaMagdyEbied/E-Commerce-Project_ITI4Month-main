/* ------------------ SHOW / HIDE PASSWORD ------------ */
function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    icon.innerText = "visibility_off";
  } else {
    input.type = "password";
    icon.innerText = "visibility";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|edu\.eg|gov\.eg|com\.eg|io)$/i;
    return emailRegex.test(email);
  }

  /* --------------------------- REGISTER LOGIC -------------------- */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("suName").value.trim();
      const email = document.getElementById("suEmail").value.trim();
      const password = document.getElementById("suPassword").value.trim();
      const confirmPass = document.getElementById("suConfirmPassword").value.trim();

      if (name.length < 3) return alert("Name is too short!");
      if (!isValidEmail(email)) return alert("Please use a valid official email (e.g., .com, .edu.eg)");
      if (password.length < 6) return alert("Password must be at least 6 characters");
      if (password !== confirmPass) return alert("Passwords do not match!");
      
      if (users.some((u) => u.email === email)) return alert("This email is already registered!");

      users.push({ name, email, password, role: "customer" });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful! Redirecting to login...");
      window.location.href = "login.html";
    });
  }

  /* ------------------- LOGIN LOGIC ----------------------- */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const emailInput = document.getElementById("liEmail").value.trim().toLowerCase();
      const passwordInput = document.getElementById("liPassword").value.trim();
      const isAdminLogin = document.getElementById("adminLogin").checked;

      let targetUser = null;

      if (isAdminLogin) {
        const admins = JSON.parse(localStorage.getItem("admins")) || [];
        targetUser = admins.find((u) => u.email.trim().toLowerCase() === emailInput);
        if (targetUser) targetUser.role = "admin"; 
      } else {
        targetUser = users.find((u) => u.email.trim().toLowerCase() === emailInput);
      }

      if (!targetUser) {
        return alert("This email is not registered in the selected category.");
      }

      if (targetUser.password !== passwordInput) {
        return alert("Incorrect password!");
      }

      localStorage.setItem("currentUser", JSON.stringify(targetUser));
      alert("Login successful! Welcome " + (targetUser.name || targetUser.fullName));

      if (isAdminLogin) {
        window.location.href = "AdminHtml/dashboard.html";
      } else {
        window.location.href = "index.html"; 
      }
    }); 
  } 
}); 