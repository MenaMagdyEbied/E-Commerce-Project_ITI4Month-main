/* ------------------ 1. وظائف مساعدة ------------------ */
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

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@(gmail|yahoo|outlook|hotmail|icloud)\.(com|net|org|edu\.eg|gov\.eg|com\.eg|io)$/i;
  return emailRegex.test(email);
}

/* ------------------ 2. المنطق الرئيسي ------------------ */
document.addEventListener("DOMContentLoaded", function () {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let admins = JSON.parse(localStorage.getItem("admins")) || [];

  // تحديث اسم المستخدم في الناف بار
  function updateUI() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const nameLabel = document.getElementById("userNameDisplay");
    if (user && nameLabel) {
      nameLabel.innerText = user.name || user.fullName || "User";
    }
  }
  updateUI();

  /* ------------------- تسجيل حساب جديد (Register) ------------------- */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("suName").value.trim().replace(/\s+/g, ' ');
      const email = document.getElementById("suEmail").value.trim().toLowerCase();
      const password = document.getElementById("suPassword").value.trim();
      const confirmPass = document.getElementById("suConfirmPassword").value.trim();

      // التحقق (Validation)
      if (name.length < 8 || !name.includes(" ")) return alert("Please enter your full name.");
      if (!isValidEmail(email)) return alert("Invalid email format!");
      if (password.length < 8) return alert("Password must be at least 8 characters.");
      if (password !== confirmPass) return alert("Passwords do not match!");
      
      if (users.some((u) => u.email === email)) return alert("Email already exists!");

      // إضافة المستخدم مع مصفوفات السلة والويشليست (إضافة زميلك)
      users.push({ 
        name, 
        email, 
        password, 
        role: "customer", 
        wishlist: [], 
        cart: [] 
      });

      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful! Redirecting to login...");
      window.location.href = "login.html";
    });
  }

  /* ------------------- تسجيل الدخول (Login) ------------------- */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailInput = document.getElementById("liEmail").value.trim().toLowerCase();
      const passwordInput = document.getElementById("liPassword").value.trim();
      const isAdminLogin = document.getElementById("adminLogin").checked;

      let targetUser = null;

      // الاعتماد على مصفوفتين منفصلتين (طلبك أنت)
      if (isAdminLogin) {
        targetUser = admins.find((u) => u.email.trim().toLowerCase() === emailInput);
        if (targetUser) targetUser.role = "admin"; 
      } else {
        targetUser = users.find((u) => u.email.trim().toLowerCase() === emailInput);
      }

      if (!targetUser) return alert("Email not found in the selected category.");
      if (targetUser.password !== passwordInput) return alert("Incorrect password!");

      // نقل بيانات السلة والويشليست للجلسة (إضافة زميلك)
      localStorage.setItem("currentUser", JSON.stringify(targetUser));

      alert("Login successful! Welcome " + (targetUser.name || targetUser.fullName));

      // التوجيه (Redirect)
      if (isAdminLogin) {
        window.location.href = "AdminHtml/dashboard.html";
      } else {
        window.location.href = "index.html"; 
      }
    });
  }
});
  /* ------------------- تسجيل خروج (Logout) ------------------- */

function logoutUser() {
    if (confirm("Are you sure you want to logout?")) {
        // بنشيل "البروفايل" اللي مفتوح دلوقتي
        localStorage.removeItem('currentUser');

        alert("Logged out successfully!");

        // نرجعه للهوم ونعمل ريفريش عشان دالة display() تشتغل وتلاقي wishlist فاضية
        window.location.href = "Home.html";
    }
}


