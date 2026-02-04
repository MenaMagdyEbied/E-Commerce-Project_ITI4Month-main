document.addEventListener("DOMContentLoaded", () => {

    const cartContainer = document.querySelector(".items");
    const cartCount = document.querySelector("#cartCount");
    const subtotalEl = document.querySelector("#subtotal");
    const taxEl = document.querySelector("#tax");
    const totalEl = document.querySelector("#total");
    const placeOrderBtn = document.querySelector("#placeOrderBtn");

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    let cart = currentUser.cart || [];

    renderCart();

    /* ================= RENDER CART ================= */
    function renderCart() {
        cartContainer.innerHTML = "";

        if (cart.length === 0) {
            cartContainer.innerHTML = `<p class="text-muted">Your cart is empty</p>`;
            cartCount.innerText = "You have 0 items in your bag";
            updateSummary();
            return;
        }

        cart.forEach((item, index) => {
            cartContainer.insertAdjacentHTML("beforeend", `
                <div class="card cart-card shadow-sm border-0 p-1 my-3" data-index="${index}">
                    <div class="row g-0 align-items-center">
                        <div class="col-md-2 col-3">
                            <img src="${item.img}" class="img-fluid rounded-start cart-img" alt="${item.title}">
                        </div>
                        <div class="col-md-10 col-9 p-2">
                            <div class="d-flex justify-content-between">
                                <h6 class="mb-0 text-truncate">${item.title}</h6>
                                <strong>$${item.price}</strong>
                            </div>
                            <div class="d-flex mt-2 align-items-center">
                                <div class="qty-box d-flex align-items-center gap-2">
                                    <button class="btn btn-outline-secondary btn-sm minus">−</button>
                                    <span class="fw-medium">${item.quantity}</span>
                                    <button class="btn btn-outline-secondary btn-sm plus">+</button>
                                </div>
                                <button class="btn p-0 btn-remove mx-3 remove">
                                    <i class="fa-regular fa-trash-can"></i> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });

        cartCount.innerText = `You have ${cart.length} items in your bag`;
        updateSummary();
    }

    /* ================= EVENT DELEGATION ================= */
    cartContainer.addEventListener("click", (e) => {
        const card = e.target.closest(".cart-card");
        if (!card) return;

        const index = Number(card.dataset.index);

        if (e.target.closest(".plus")) cart[index].quantity++;
        if (e.target.closest(".minus")) {
            cart[index].quantity--;
            if (cart[index].quantity <= 0) cart.splice(index, 1);
        }
        if (e.target.closest(".remove")) cart.splice(index, 1);

        saveCart();
        renderCart();
    });

    /* ================= SUMMARY ================= */
    function updateSummary() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxEl.textContent = `$${tax.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    /* ================= SAVE CART ================= */
    function saveCart() {
        currentUser.cart = cart;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const idx = users.findIndex(u => u.email === currentUser.email);
        if (idx !== -1) {
            users[idx] = currentUser;
            localStorage.setItem("users", JSON.stringify(users));
        }
    }

    /* ================= PLACE ORDER ================= */
    placeOrderBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty");
            return;
        }

        const order = {
            id: Date.now(),
            customerName: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone || "",
            address: currentUser.address || "",
            items: cart.map(item => ({
                name: item.title,
                quantity: item.quantity,
                image:item.img,
                price: item.price
            })),
            totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            status: "Pending"
        };

        let orders = JSON.parse(localStorage.getItem("confirmedOrders")) || [];
        orders.push(order);
        localStorage.setItem("confirmedOrders", JSON.stringify(orders));

        cart = [];
        saveCart();

        alert("Order placed successfully ");
        window.location.href = "user-orders.html";
    });

});
