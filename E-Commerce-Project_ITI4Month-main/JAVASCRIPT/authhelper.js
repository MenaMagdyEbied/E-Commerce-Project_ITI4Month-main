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
        // نجيب اليوزر الحالي والمخزن الكبير
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        //  نجيب الويش ليست الحالية (إما من اليوزر أو من الـ localStorage)
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        const index = wishlist.findIndex(item => item.title === name);

        if (index === -1) {
            wishlist.push({ title: name, price, img });
            alert('Added to Wishlist!');
        } else {
            wishlist.splice(index, 1);
            alert('Removed from Wishlist!');
        }

        //    نحدث المخزن الكبير (users)
        const userIdx = users.findIndex(u => u.email === currentUser.email);
        if (userIdx !== -1) {
            users[userIdx].wishlist = wishlist; // بنحدث الويش ليست جوه اليوزر في المخزن
            localStorage.setItem('users', JSON.stringify(users)); // بنحفظ المخزن كله
        }

        // 4. نحدث الويشليست اللحظي واليوزر الحالي
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        currentUser.wishlist = wishlist;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // 5. إعادة رسم القلوب
        if (typeof display === "function") display();
    });
}

function addToCart(name, price, img) {
    handleUserAction(() => {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        // 1. نجيب الكارت الحالي من الـ localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // 2. نشوف المنتج موجود ولا لأ (عشان نزود الكمية مثلاً أو نضيفه)
        const index = cart.findIndex(item => item.title === name);

        if (index === -1) {
            cart.push({ title: name, price, img, quantity: 1 });
            alert('Added to Cart!');
        } else {
            cart[index].quantity += 1;
            alert('Updated quantity in Cart!');
        }

        //  التحديث في المخزن الكبير (users) 
        const userIdx = users.findIndex(u => u.email === currentUser.email);
        if (userIdx !== -1) {
            users[userIdx].cart = cart; 
            localStorage.setItem('users', JSON.stringify(users));
        }

        //  تحديث ال localStorage واليوزر الحالي
        localStorage.setItem('cart', JSON.stringify(cart));
        currentUser.cart = cart;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        //   فانكشن بتحدث رقم الكارت اللي فوق في الناف بار  
        // if(typeof updateCartCount === "function") updateCartCount();
    });
}
/* ------------------ تحديث اسم المستخدم في الناف بار ------------------ */

function updateNavbarName() {
    const userData = localStorage.getItem("currentUser");
    const nameLabel = document.getElementById("userNameDisplay");

    if (userData && nameLabel) {
        const user = JSON.parse(userData);
        // بنستخدم .name عشان ده المفتاح اللي في الـ Storage عندك
        nameLabel.innerText = user.name || "User"; 
    }
}

/* ------------------ فانكشن تسجيل الخروج ------------------ */
function logoutUser() {
    if (confirm("Are you sure you want to logout?")) {
        // بنشيل "البروفايل" اللي مفتوح دلوقتي
        localStorage.removeItem('currentUser');
        
        // بنشيل الويش ليست والكارت اللحظي عشان الـ UI ينضف 
        localStorage.removeItem('wishlist');
        localStorage.removeItem('cart');
        
        alert("Logged out successfully!");
        
        // نرجعه للهوم ونعمل ريفريش عشان دالة display() تشتغل وتلاقي wishlist فاضية
        window.location.href = "Home.html"; 
    }
}

// تشغيل التحديث اول ما الصفحه تحمل
document.addEventListener("DOMContentLoaded", updateNavbarName);

// فانكشن لتحديث الواجهة بالاسم
function refreshNavbarUI() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const nameLabel = document.getElementById("userNameDisplay");

    if (user && nameLabel) {
        // بنجرب نجيب name ولو مفيش بنجرب username
        nameLabel.innerText = user.name || user.username || "User";
    }
}

setTimeout(refreshNavbarUI);