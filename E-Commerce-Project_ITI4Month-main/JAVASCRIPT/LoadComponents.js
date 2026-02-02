function loadComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    });
}

loadComponent("navbar", "../HTML/navbar.html");
 loadComponent("footer", "../HTML/footer.html");

function updateNavbarUI() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.getElementById('loginBtn');
    const userDropdown = document.getElementById('userDropdown');
    const userNameDisplay = document.getElementById('userNameDisplay');

    if (user) {
        if(loginBtn) loginBtn.classList.add('d-none');
        if(userDropdown) userDropdown.classList.remove('d-none');
        if(userNameDisplay) userNameDisplay.innerText = user.name || "User Account";
    } else {
        if(loginBtn) loginBtn.classList.remove('d-none');
        if(userDropdown) userDropdown.classList.add('d-none');
    }
}

window.addEventListener('load', updateNavbarUI);