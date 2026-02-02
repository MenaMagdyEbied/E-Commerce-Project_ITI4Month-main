/* ------------------ 1. SHOW / HIDE PASSWORD ------------------ */
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

/* ------------------ 2. CREATE DEFAULT ADMIN ------------------ */
function createDefaultAdmin() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (!users.some(u => u.email === "admin@gmail.com")) {
    users.push({
      name: "Mena Admin",
      email: "admin@gmail.com",
      password: "admin123456",
      role: "admin",
      wishlist: [], // ضيفنا دول عشان ميعملش Error
      cart: []
    });
    localStorage.setItem("users", JSON.stringify(users));
  }
}

/* ------------------ 3. MAIN LOGIC ------------------ */
document.addEventListener("DOMContentLoaded", function () {
  createDefaultAdmin();
  let users = JSON.parse(localStorage.getItem("users")) || [];

  function updateUI() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const nameLabel = document.getElementById("userNameDisplay");
    if (user && nameLabel) {
        nameLabel.innerText = user.name;
    }
  }

  setTimeout(updateUI, 500);

  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@(gmail|yahoo|outlook|hotmail|icloud)\.(com|net|org|edu\.eg|gov\.eg|com\.eg|io)$/i;
    return emailRegex.test(email);
  }

  /* --------------------------- REGISTER LOGIC -------------------- */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("suName").value.trim().replace(/\s+/g, ' ');
      const email = document.getElementById("suEmail").value.trim().toLowerCase();
      const password = document.getElementById("suPassword").value.trim();
      const confirmPass = document.getElementById("suConfirmPassword").value.trim();

      if (name.length < 8 || !name.includes(" ")) return alert("Please enter your full name.");
      if (!isValidEmail(email)) return alert("Invalid email format!");
      if (password.length < 8) return alert("Password must be at least 8 characters.");
      if (password !== confirmPass) return alert("Passwords do not match!");
      
      if (users.some((u) => u.email.toLowerCase() === email)) return alert("Email already exists!");

      // لما يفتح حساب جديد نأسس له مصفوفة فاضية للويش والكارت
      users.push({ name, email, password, role: "customer", wishlist: [], cart: [] });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Account created! Go to Login.");
      window.location.href = "login.html";
    });
  }

  /* ------------------- LOGIN LOGIC  ----------------------- */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailInput = document.getElementById("liEmail").value.trim().toLowerCase();
      const passwordInput = document.getElementById("liPassword").value.trim();
      const isAdminLogin = document.getElementById("adminLogin").checked;

      users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((u) => u.email.toLowerCase() === emailInput);

      if (!user) return alert("This email is not registered.");
      if (user.password !== passwordInput) return alert("Incorrect password!");

      if (user.role === "admin" && !isAdminLogin) {
          return alert("This email is registered as an Admin.");
      }

      // ---  استرجاع البيانات ---
      if (isAdminLogin) {
        if (user.role !== "admin") return alert("Access denied!");
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Welcome Admin!");
        window.location.href = "../HTML/AdminHtml/dashboard.html"; 
      } else {
        // بننقل الداتا من بروفايل اليوزر للـ Session الحالية
        const userWishlist = user.wishlist || [];
        const userCart = user.cart || [];
        
        localStorage.setItem("wishlist", JSON.stringify(userWishlist));
        localStorage.setItem("cart", JSON.stringify(userCart));
        localStorage.setItem("currentUser", JSON.stringify(user));

        alert("Welcome " + user.name);
        window.location.href = "index.html"; 
      }
    });
  }
});