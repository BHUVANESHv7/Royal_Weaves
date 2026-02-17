// Cart state management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countElement) {
        countElement.innerText = totalCount;
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        saveCart();
        updateCartCount();
        if (typeof renderCart === 'function') renderCart();
    }
}

function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            // Optional: Remove if quantity becomes 0, or keep at 1
            // For now, let's keep it at 1 or ask user confirmation to remove
            if (confirm("Remove item from cart?")) {
                cart = cart.filter(i => i.id !== id);
            }
        }
        saveCart();
        updateCartCount();
        if (typeof renderCart === 'function') renderCart();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const btn = e.target;
            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: btn.dataset.price,
                image: btn.dataset.image
            };
            addToCart(product);
        });
    });

    document.querySelectorAll('.buy-now').forEach(button => {
        button.addEventListener('click', (e) => {
            const btn = e.target;
            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: btn.dataset.price,
                image: btn.dataset.image
            };
            addToCart(product);
            window.location.href = '/cart';
        });
    });
});
