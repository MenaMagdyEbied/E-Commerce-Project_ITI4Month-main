document.addEventListener('DOMContentLoaded', () => {
    const adminForm = document.querySelector('form');
    const adminTableBody = document.querySelector('tbody');
    const editModalElement = document.getElementById('editModal');
    const editModal = new bootstrap.Modal(editModalElement);
    
    let admins = JSON.parse(localStorage.getItem('admins')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let currentRowEditingId = null;

    // --- 1. تحميل البيانات ---
    renderTable();

    // --- 2. إضافة Admin جديد ---
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputs = adminForm.querySelectorAll('input');
        const fullName = inputs[0].value.trim();
        const email = inputs[1].value.trim();
        const password = inputs[2].value;

        if (admins.some(admin => admin.email === email)) {
            alert('هذا البريد الإلكتروني مسجل مسبقاً!');
            return;
        }

        if (fullName && email && password) {
            const newAdmin = {
                id: Date.now(),
                name: fullName,
                email,
                password,
                date: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                })
            };

            admins.push(newAdmin);
            saveAndRefresh();
            adminForm.reset();
        }
    });

    // --- 3. أزرار الجدول (حذف / تعديل) ---
    adminTableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const adminId = parseInt(btn.closest('tr').dataset.id);

        // حذف
        if (btn.classList.contains('text-danger')) {
            if (confirm('هل أنت متأكد من حذف هذا المسؤول؟')) {
                admins = admins.filter(admin => admin.id !== adminId);

                // لو الأدمن المحذوف هو الحالي
                if (currentUser && currentUser.id === adminId) {
                    localStorage.removeItem('currentUser');
                }

                saveAndRefresh();
            }
        }

        // تعديل
        if (btn.classList.contains('text-muted')) {
            const admin = admins.find(a => a.id === adminId);
            if (admin) {
                currentRowEditingId = adminId;
                editModalElement.querySelector('input[type="text"]').value = admin.name;
                editModalElement.querySelector('input[type="email"]').value = admin.email;
                editModalElement.querySelector('input[type="password"]').value = admin.password;
                editModal.show();
            }
        }
    });

    // --- 4. حفظ التعديلات ---
    editModalElement.querySelector('.btn-primary').addEventListener('click', () => {
        const newName = editModalElement.querySelector('input[type="text"]').value.trim();
        const newEmail = editModalElement.querySelector('input[type="email"]').value.trim();
        const newPassword = editModalElement.querySelector('input[type="password"]').value;

        if (!currentRowEditingId) return;

        admins = admins.map(admin => {
            if (admin.id === currentRowEditingId) {
                const updatedAdmin = {
                    ...admin,
                    name: newName,
                    email: newEmail,
                    password: newPassword
                };

                // تحديث currentUser لو هو نفس الأدمن
                if (currentUser && currentUser.id === admin.id) {
                    currentUser = updatedAdmin;
                    localStorage.setItem('currentUser', JSON.stringify(updatedAdmin));
                }

                return updatedAdmin;
            }
            return admin;
        });

        saveAndRefresh();
        editModal.hide();
        currentRowEditingId = null;
    });

    // --- Helpers ---
    function saveAndRefresh() {
        localStorage.setItem('admins', JSON.stringify(admins));
        renderTable();
    }

    function renderTable() {
        adminTableBody.innerHTML = '';
        admins.forEach(admin => {
            const firstLetter = admin.name.charAt(0).toUpperCase();
            const row = `
                <tr data-id="${admin.id}">
                    <td class="ps-4 py-3">
                        <span class="admins-pic me-2">${firstLetter}</span>
                        <b>${admin.name}</b>
                    </td>
                    <td>${admin.email}</td>
                    <td>${admin.date}</td>
                    <td class="text-center">
                        <button class="admins-btn-icon text-muted">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="admins-btn-icon text-danger">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </td>
                </tr>
            `;
            adminTableBody.insertAdjacentHTML('beforeend', row);
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || currentUser.role !== "admin") {
    alert("Access denied. Admins only.");
    window.location.href = "../login.html";
  }
});

