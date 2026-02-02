function initOrdersPage() {
    const ordersContainer = document.getElementById('orderTableBody'); 
    if (!ordersContainer) return;

    const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];

    if (confirmedOrders.length === 0) {
        ordersContainer.innerHTML = '<tr><td colspan="5" class="text-center p-4">No orders found.</td></tr>';
        return;
    }

    renderOrders(confirmedOrders);
}

function renderOrders(orders) {
    const container = document.getElementById('orderTableBody');
    container.innerHTML = '';

    orders.forEach((order, index) => {
        const tr = document.createElement('tr');
        tr.className = 'order-row';
        tr.setAttribute('data-status', order.status.toLowerCase());
        
        tr.innerHTML = `
            <td class="ps-4"><b>#${order.id}</b></td>
            <td>${order.customerName || 'Ahmed Ashraf'}</td>
            <td class="fw-bold">${order.totalPrice || order.total} EGP</td>
            <td>
                <span class="orders-status status-${order.status.toLowerCase()} status-text">
                    ${order.status}
                </span>
            </td>
            <td class="text-end pe-4 action-cell">
                ${order.status.toLowerCase() === 'pending' ? `
                    <button onclick="updateStatus(this, 'confirmed', ${index})" class="btn btn-primary btn-sm rounded-pill px-3">Confirm</button>
                    <button onclick="updateStatus(this, 'rejected', ${index})" class="btn btn-outline-danger btn-sm rounded-pill px-3 ms-1">Reject</button>
                ` : `
                    <span class="text-muted small me-2">Processed</span>
                `}
                <button class="btn btn-link text-primary text-decoration-none fw-bold" onclick="viewDetails('${order.id}')">Details</button>
            </td>
        `;
        container.appendChild(tr);
    });
}

function updateStatus(btn, type, index) {
    let orders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
    
    orders[index].status = type === 'confirmed' ? 'Confirmed' : 'Rejected';
    localStorage.setItem('confirmedOrders', JSON.stringify(orders));

    const row = btn.closest('tr');
    const statusSpan = row.querySelector('.status-text');
    
    row.setAttribute('data-status', type);
    statusSpan.className = `orders-status status-${type} status-text`;
    statusSpan.innerText = type.charAt(0).toUpperCase() + type.slice(1);

    const actionCell = row.querySelector('.action-cell');
    actionCell.innerHTML = `
        <span class="text-muted small me-2">Processed</span> 
        <button class="btn btn-link text-primary text-decoration-none fw-bold" onclick="viewDetails('${orders[index].id}')">Details</button>
    `;
}

function viewDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
    const order = orders.find(o => o.id == orderId);

    if (!order) return;

    const modalTitle = document.querySelector('#detailsModal .modal-title');
    const modalBody = document.querySelector('#detailsModal .modal-body');

    modalTitle.innerHTML = `Order Details <span class="text-muted fs-6">#${order.id}</span>`;
    
    modalBody.innerHTML = `
        <div class="row mb-4">
            <div class="col-md-6">
                <p class="text-muted mb-1">Customer Info</p>
                <h6 class="fw-bold">${order.customerName || 'N/A'}</h6>
                <p class="small text-muted">${order.email || ''}<br>${order.phone || ''}</p>
            </div>
            <div class="col-md-6 text-md-end">
                <p class="text-muted mb-1">Shipping Address</p>
                <p class="small">${order.address || 'N/A'}</p>
            </div>
        </div>
        <div class="table-responsive border rounded-3">
            <table class="table table-borderless m-0">
                <thead class="bg-light border-bottom">
                    <tr class="small text-muted">
                        <th class="ps-3">Item</th>
                        <th>Qty</th>
                        <th class="text-end pe-3">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${(order.items || []).map(item => `
                        <tr>
                            <td class="ps-3 py-3">${item.name}</td>
                            <td>${item.quantity}</td>
                            <td class="text-end pe-3">${item.price} EGP</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot class="border-top">
                    <tr>
                        <td colspan="2" class="text-end fw-bold py-3">Total Amount:</td>
                        <td class="text-end pe-3 fw-bold text-primary fs-5">${order.totalPrice || order.total} EGP</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;

    const modalElement = document.getElementById('detailsModal');
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
}

function filterOrders(type, tab) {
    document.querySelectorAll('.orders-tab-item').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const rows = document.querySelectorAll('.order-row');
    rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        row.style.display = (type === 'all' || rowStatus === type) ? '' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', initOrdersPage);

document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "admin") {
        window.location.href = "../login.html";
    }
});

