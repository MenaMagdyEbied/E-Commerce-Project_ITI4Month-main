function saveOrderToStorage(items, total) {
    const orderData = {
        id: Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleDateString(),
        totalPrice: total,
        status: 'Pending',
        products: items
    };

    let orders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
    orders.push(orderData);
    localStorage.setItem('confirmedOrders', JSON.stringify(orders));
    
    window.location.href = 'orders.html';
}