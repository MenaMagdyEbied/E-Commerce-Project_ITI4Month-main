const products = [];
const imgs = {
    "Laptops": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
    "Phones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    "Tablets": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
    "Watches": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    "Accessories": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
};

const catList = ["Laptops", "Phones", "Tablets", "Watches", "Accessories"];

// إنشاء 100 منتج 
for (let i = 1; i <= 100; i++) {
    let cat = catList[i % catList.length];
    products.push({
        id: i, name: `${cat} Premium ${i}`, category: cat,
        price: Math.floor(Math.random() * 1400) + 30, img: imgs[cat] + "&sig=" + i,
        ratingValue: (Math.random() * (5 - 3.5) + 3.5).toFixed(1)
    });
}

let filtered = [...products];
let currentPage = 1, perPage = 12;

// --- الدالة اللي فيها الشغل كله (التصميم الجديد) ---
function display() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = "";
    const items = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
    
    items.forEach(p => {
        grid.innerHTML += `
            <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card product-card shadow-sm h-100 border-0" style="border-radius: 15px; overflow: hidden;">
                    
                    <div class="p-3 bg-light text-center">
                        <img src="${p.img}" class="img-fluid" style="height: 160px; object-fit: contain;">
                    </div>

                    <div class="card-body p-3 d-flex flex-column">
                        <h6 class="fw-bold text-truncate mb-1">${p.name}</h6>
                        <p class="mb-2 small">
                            <span class="rating-num fw-bold text-dark">${p.ratingValue}</span> 
                            <span class="text-warning">★★★★☆</span>
                        </p>
                        <p class="price mb-3 fw-bold text-primary fs-5">$${p.price}</p>
                        
                        <div class="d-flex gap-2 mt-auto">
                            <a href="product.html?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}&rating=${p.ratingValue}" 
                               class="btn btn-primary btn-sm flex-grow-1 rounded-3 d-flex align-items-center justify-content-center fw-bold">
                               View
                            </a>
                            
                            <button class="btn btn-outline-secondary btn-sm rounded-3 d-flex align-items-center justify-content-center" 
                                    style="width: 38px; height: 38px;" onclick="addToCart('${p.name}')">
                                <i class="bi bi-cart-plus"></i>
                            </button>

                            <button class="btn btn-outline-danger btn-sm rounded-3 d-flex align-items-center justify-content-center" 
                                    style="width: 38px; height: 38px;" onclick="toggleWishlist(this)">
                                <i class="bi bi-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    });
    renderPagination();
}

// --- باقي الوظائف (بقية الـ Logic بتاعك زي ما هو) ---

function renderPagination() {
    const controls = document.getElementById('paginationControls');
    if(!controls) return;
    controls.innerHTML = "";
    const total = Math.ceil(filtered.length / perPage);
    for (let i = 1; i <= total; i++) {
        controls.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><button class="page-link shadow-none" onclick="currentPage=${i}; display(); window.scrollTo(0,0)">${i}</button></li>`;
    }
}

function updatePriceLabel(val) {
    document.getElementById('maxPriceLabel').innerText = val;
    filterProducts();
}

function toggleAll(el) {
    const checkboxes = document.querySelectorAll('input[name="cat"]');
    if (el.checked) {
        checkboxes.forEach(cb => cb.checked = false);
    }
    filterProducts();
}

function updateFilters() {
    const checkboxes = document.querySelectorAll('input[name="cat"]:checked');
    const allCheck = document.getElementById('catAll');
    if (checkboxes.length > 0) { allCheck.checked = false; } 
    else { allCheck.checked = true; }
    filterProducts();
}

function clearFilters() {
    document.getElementById('catAll').checked = true;
    document.querySelectorAll('input[name="cat"]').forEach(cb => cb.checked = false);
    document.getElementById('priceSlider').value = 1500;
    document.getElementById('maxPriceLabel').innerText = 1500;
    const searchBar = document.getElementById('searchBar');
    if(searchBar) searchBar.value = '';
    filterProducts();
}

function filterProducts() {
    const searchInput = document.getElementById('searchBar');
    const search = searchInput ? searchInput.value.toLowerCase() : "";
    const maxPrice = parseInt(document.getElementById('priceSlider').value);
    const selectedCats = Array.from(document.querySelectorAll('input[name="cat"]:checked')).map(cb => cb.value);
    const isAll = document.getElementById('catAll').checked;

    filtered = products.filter(p => {
        const mSearch = p.name.toLowerCase().includes(search);
        const mCat = isAll || selectedCats.includes(p.category);
        const mPrice = p.price <= maxPrice;
        return mSearch && mCat && mPrice;
    });
    currentPage = 1;
    display();
}

// دوال إضافية للتشغيل
function addToCart(name) { alert("Added to cart: " + name); }
function toggleWishlist(btn) { 
    const icon = btn.querySelector('i');
    icon.classList.toggle('bi-heart');
    icon.classList.toggle('bi-heart-fill');
    btn.classList.toggle('btn-danger');
    btn.classList.toggle('btn-outline-danger');
}

// التنفيذ عند التحميل
document.addEventListener("DOMContentLoaded", () => {
    display();
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const nameLabels = document.querySelectorAll(".user-name-nav");
    if (user) { nameLabels.forEach(label => label.innerText = user.username); }
});
         
        //  التحكم في كلاس السكرول
window.onscroll = function() {
    const navbar = document.getElementById('mainNavbar');
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('nav-scrolled');
    }
};


//  دالة تسجيل الخروج
function logoutUser() {
    localStorage.removeItem("currentUser");
    alert("Signing out...");
    window.location.href = "login.html";
}

//  تحديث اسم المستخدم
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const nameLabels = document.querySelectorAll(".user-name-nav");
    if (user) {
        nameLabels.forEach(label => label.innerText = user.username);
    }
});