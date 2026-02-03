document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || currentUser.role !== "admin") {
    alert("Access denied. Admins only.");
    window.location.href = "../login.html";
  }


    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();

        localStorage.removeItem("currentUser");
        window.location.href = "../login.html";
    });
});
