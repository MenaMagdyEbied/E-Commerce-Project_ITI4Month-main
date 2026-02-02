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
    if(document.getElementById('loader')) document.getElementById('loader').style.display = 'block';
    try {
        const res = await Promise.all(urls.map(u => fetch(u).then(r => r.json())));
        products = res.flatMap(d => d.products.map(p => ({
            id: p.id, name: p.title, price: p.price, img: p.thumbnail, rating: p.rating, category: p.category
        })));
        filtered = [...products];
        display();
    } catch (e) { console.error(e); }
    if(document.getElementById('loader')) document.getElementById('loader').style.display = 'none';
}

function display() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = "";
    const items = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
    
    // --- التعديل هنا يا مينا ---
    const user = JSON.parse(localStorage.getItem('currentUser'));
    // لو مفيش يوزر، الويش ليست هتبقى فاضية غصب عنها، فالقلوب هتبقى سوداء
    const wishlist = user ? (JSON.parse(localStorage.getItem('wishlist')) || []) : [];
    // ---------------------------

    items.forEach(p => {
        const isFavorite = wishlist.some(item => item.title === p.name);
        grid.innerHTML += `
        <div class="col-md-4 col-lg-3">
            <div class="card product-card border-0 shadow-sm h-100">
                <div class="img-container p-3 text-center">
                    <img src="${p.img}" style="height:150px; object-fit:contain; width:100%;">
                </div>
                <div class="card-body d-flex flex-column">
                    <h6 class="fw-bold text-truncate">${p.name}</h6>
                    <div class="mb-2 small">${getStars(p.rating)} <span class="text-muted">(${p.rating})</span></div>
                    <h5 class="text-primary fw-bold mb-3 mt-auto">$${p.price}</h5>
                    <div class="d-flex gap-2">
                        <a href="product.html?id=${p.id}&name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}" class="btn btn-primary btn-view">View</a>
                        
                        <button class="btn btn-cart-icon" onclick="addToCart('${p.name}', ${p.price}, '${p.img}')">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                        <button class="btn btn-wish-icon ${isFavorite ? 'active' : ''}" 
                                onclick="addToWishlist('${p.name}', ${p.price}, '${p.img}'); display();">
                            <i class="bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    });
    renderPagination();
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
    if(!container) return;
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