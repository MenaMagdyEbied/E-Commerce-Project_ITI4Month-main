document.addEventListener("DOMContentLoaded", function () {
    const wishlistContainer = document.querySelector(".wishlist .row");
    const wishlistCount = document.querySelector(".wishlist p.text-muted");

    // جلب wishlist من currentUser
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let wishlist = currentUser?.wishlist || [];

    // تحديث عدد العناصر
    wishlistCount.innerText = `You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your wishlist`;


    // لو مفيش عناصر
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `<p class="text-center text-muted">Your wishlist is empty!</p>`;
        return;
    }

    // إنشاء العناصر بشكل ديناميكي
    wishlist.forEach((item, index) => {
        const col = document.createElement("div");
        col.className = "col-md-4 col-sm-6";

        col.innerHTML = `
            <div class="card wishlist-card h-100 border-0 shadow-sm">
                <img src="${item.img}" class="card-img-top wishlist-img" alt="${item.title}">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-truncate">${item.title}</h6>
                    <strong class="mb-2">$${item.price}</strong>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <button class="btn btn-sm btn-primary" onclick="addToCart('${item.title}', ${item.price}, '${item.img}')">
                            <i class="fa-solid fa-cart-plus me-1"></i> Add to Cart
                        </button>
                        <button class="btn btn-sm btn-wishlist-remove" onclick="removeFromWishlist(${index})">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        wishlistContainer.appendChild(col);
    });
});

// إزالة عنصر من الويشليست
function removeFromWishlist(index) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let wishlist = currentUser.wishlist || [];

    wishlist.splice(index, 1);

    currentUser.wishlist = wishlist;

    // تحديث المستخدم في localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIdx = users.findIndex(u => u.email === currentUser.email);
    if (userIdx !== -1) {
        users[userIdx].wishlist = wishlist;
        localStorage.setItem("users", JSON.stringify(users));
    }

    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    
    // إعادة تحميل الصفحة أو تحديث الـ DOM
    location.reload();
}
