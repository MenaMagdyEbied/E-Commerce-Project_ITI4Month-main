let products = [];
let filtered = [];
let currentPage = 1;
const perPage = 12;
const urls = [
    'https://dummyjson.com/products/category/laptops',
    'https://dummyjson.com/products/category/smartphones',
    'https://dummyjson.com/products/category/mens-watches',
    'https://dummyjson.com/products/category/tablets',
    'https://dummyjson.com/products/category/mobile-accessories'
];

async function loadProducts() {
    if (document.getElementById('loader')) document.getElementById('loader').style.display = 'block';
    try {
        const res = await Promise.all(urls.map(u => fetch(u).then(r => r.json())));
        products = res.flatMap(d => d.products.map(p => ({
            id: p.id, name: p.title, price: p.price, img: p.thumbnail, rating: p.rating, category: p.category
        })));
        filtered = [...products];
        display();
    } catch (e) { console.error(e); }
    if (document.getElementById('loader')) document.getElementById('loader').style.display = 'none';
}

function display() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = "";

    const items = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const wishlist = user ? user.wishlist || [] : [];

    items.forEach(p => {
        const inWishlist = wishlist.some(item => item.title === p.name);
        const cardClass = inWishlist ? 'product-card wishlist-active border-0 shadow-sm h-100' : 'product-card border-0 shadow-sm h-100';

        grid.innerHTML += `
        <div class="col-md-4 col-lg-3">
            <div class="${cardClass} p-3">
                <div class="img-container p-3 text-center">
                    <img src="${p.img}" style="height:150px; object-fit:contain; width:100%;">
                </div>
                <div class="card-body d-flex flex-column">
                    <h6 class="fw-bold text-truncate">${p.name}</h6>
                    <div class="mb-2 small">${getStars(p.rating)} <span class="text-muted">(${p.rating})</span></div>
                    <h5 class="text-primary fw-bold mb-3 mt-auto">$${p.price}</h5>
                   <div class="d-flex justify-content-between align-items-center mt-auto">
                   <div class="d-flex gap-2">
                   <a href="product.html?id=${p.id}&name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}" class="btn btn-primary btn-view">View</a>
                   <button class="btn btn-cart-icon" onclick="addToCart('${p.name}', ${p.price}, '${p.img}')">
                  <i class="bi bi-cart-plus"></i>
                  </button>
                  </div>
    
                 <button class="btn btn-wish-icon ${inWishlist ? 'active btn-danger' : 'btn-outline-secondary'}" 
                 onclick="toggleWishlist('${p.name}', ${p.price}, '${p.img}', this)">
                 <i class="bi ${inWishlist ? 'bi-heart-fill text-white' : 'bi-heart text-secondary'}"></i>
                 </button>
                </div>
                </div>
            </div>
        </div>`;
    });

    renderPagination();
}

function toggleWishlist(name, price, img, btn) {
    addToWishlist(name, price, img); // تضيف/تشيل من wishlist
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const inWishlist = user.wishlist.some(item => item.title === name);
    const icon = btn.querySelector('i');

    if (inWishlist) {
        btn.classList.add('btn-danger');
        btn.classList.remove('btn-outline-secondary');
        icon.classList.add('bi-heart-fill', 'text-white');
        icon.classList.remove('bi-heart', 'text-secondary');
    } else {
        btn.classList.add('btn-outline-secondary');
        btn.classList.remove('btn-danger');
        icon.classList.add('bi-heart', 'text-secondary');
        icon.classList.remove('bi-heart-fill', 'text-white');
    }
}


// فانكشن النجوم  
function getStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) stars += '<i class="bi bi-star-fill text-warning"></i>';
        else if (i === Math.ceil(rating) && rating % 1 >= 0.5) stars += '<i class="bi bi-star-half text-warning"></i>';
        else stars += '<i class="bi bi-star text-warning"></i>';
    }
    return stars;
}

// باقي الفانكشن الفلترة والترقيم 
function clearFilters() {
    document.getElementById('catAll').checked = true;
    document.querySelectorAll('input[name="cat"]').forEach(cb => cb.checked = false);
    document.getElementById('priceSlider').value = 3000;
    document.getElementById('maxPriceLabel').innerText = 3000;
    filterProducts();
}
function filterProducts() {
    // بنجيب السيرش من أي مكان في الصفحة
    const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || "";
    const maxPrice = parseInt(document.getElementById('priceSlider').value);
    const selectedCats = Array.from(document.querySelectorAll('input[name="cat"]:checked')).map(cb => cb.value);
    const isAll = document.getElementById('catAll').checked;

    filtered = products.filter(p => {
        const matchesName = p.name.toLowerCase().includes(searchQuery);
        const matchesCat = isAll || selectedCats.includes(p.category);
        const matchesPrice = p.price <= maxPrice;
        return matchesName && matchesCat && matchesPrice;
    });

    currentPage = 1;
    display();
}
function updatePriceLabel(v) { document.getElementById('maxPriceLabel').innerText = v; filterProducts(); }
function toggleAll(el) { if (el.checked) document.querySelectorAll('input[name="cat"]').forEach(c => c.checked = false); filterProducts(); }
function updateFilters() { document.getElementById('catAll').checked = (document.querySelectorAll('input[name="cat"]:checked').length === 0); filterProducts(); }
function renderPagination() {
    const container = document.getElementById('paginationControls');
    if (!container) return;
    container.innerHTML = "";
    const total = Math.ceil(filtered.length / perPage);
    for (let i = 1; i <= total; i++) {
        container.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><button class="page-link" onclick="currentPage=${i};display();window.scrollTo(0,0)">${i}</button></li>`;
    }
}

// تشغيل التحميل
loadProducts();
window.addEventListener('load', () => {
    // 1. قراءة المعطيات من رابط الصفحة (URL)
    const params = new URLSearchParams(window.location.search);
    const categoryFromUrl = params.get('cat'); // هيجيب مثلاً laptops

    if (categoryFromUrl) {
        //  فك العلامة من "All Products" لو موجودة
        const allCheck = document.getElementById('catAll');
        if (allCheck) allCheck.checked = false;

        //  دور على ال Checkbox اللي واخد نفس قيمة الكاتيجوري
        const targetCheckbox = document.querySelector(`.cat-check[value="${categoryFromUrl}"]`);

        if (targetCheckbox) {
            targetCheckbox.checked = true; // علّم عليه صح
            // تأكد إن اسم الفانكشن عندك updateFilters أو غيرها للي بتعمل الفلترة
            if (typeof updateFilters === 'function') {
                updateFilters();
            }
        }
    }
});


function handleUserAction(actionCallback) {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    if (user.role === 'admin') {
        alert("Admin Account: View only mode.");
        return;
    }

    actionCallback();
}

// دالة الويش ليست 
function addToWishlist(name, price, img) {
    handleUserAction(() => {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let users = JSON.parse(localStorage.getItem('users')) || [];

        currentUser.wishlist = currentUser.wishlist || [];

        const index = currentUser.wishlist.findIndex(item => item.title === name);

        if (index === -1) {
            currentUser.wishlist.push({ title: name, price, img });
            alert('Added to Wishlist!');
        } else {
            currentUser.wishlist.splice(index, 1);
            alert('Removed from Wishlist!');
        }

        // تحديث users array
        const userIdx = users.findIndex(u => u.email === currentUser.email);
        if (userIdx !== -1) {
            users[userIdx] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // حفظ currentUser فقط
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        if (typeof display === "function") display();
    });
}

// فانكشن add to cart
function addToCart(name, price, img) {
    handleUserAction(() => {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let users = JSON.parse(localStorage.getItem('users')) || [];

        currentUser.cart = currentUser.cart || [];

        const index = currentUser.cart.findIndex(item => item.title === name);

        if (index === -1) {
            currentUser.cart.push({ title: name, price, img, quantity: 1 });
            alert('Added to Cart!');
        } else {
            currentUser.cart[index].quantity += 1;
            alert('Updated quantity in Cart!');
        }

        const userIdx = users.findIndex(u => u.email === currentUser.email);
        if (userIdx !== -1) {
            users[userIdx] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        if (typeof renderCart === "function") renderCart();
        if (typeof updateCartCount === "function") updateCartCount();
    });
}