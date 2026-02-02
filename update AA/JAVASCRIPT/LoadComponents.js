function loadComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    });
}

loadComponent("navbar", "../HTML/navbar.html");
 loadComponent("footer", "../HTML/footer.html");

 