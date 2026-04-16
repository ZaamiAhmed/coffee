// Cart Logic
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

const menuData = {
    espresso: [
        { id: 'e1', name: "House Espresso", price: 3.50, description: "Double shot of our seasonal single-origin blend.", image: "espresso.png" },
        { id: 'e2', name: "Cappuccino", price: 4.75, description: "Rich espresso with thick, creamy steamed milk.", image: "menu_cappuccino.png" },
        { id: 'e3', name: "Cortado", price: 4.25, description: "Equal parts espresso and steamed milk.", image: "latte.png" },
        { id: 'e4', name: "Vanilla Latte", price: 5.50, description: "House-made Madagascar vanilla bean syrup with silky milk.", image: "latte.png" }
    ],
    filter: [
        { id: 'f1', name: "Batch Brew", price: 3.00, description: "Rotating selection of our favorite single-origin coffees.", image: "pourover.png" },
        { id: 'f2', name: "V60 Pour Over", price: 6.00, description: "Hand-poured, distinct flavor profile. Ask for today's beans.", image: "pourover.png" },
        { id: 'f3', name: "Cold Brew", price: 4.75, description: "Slow-steeped for 18 hours. Smooth, bold, and refreshing.", image: "menu_coldbrew.png" }
    ],
    tea: [
        { id: 't1', name: "Ceremonial Matcha", price: 6.00, description: "Premium grade matcha with steamed oat or regular milk.", image: "menu_coldbrew.png" },
        { id: 't2', name: "Spicy Chai Latte", price: 5.25, description: "Chai blend packed with fresh ginger and cardamom.", image: "latte.png" },
        { id: 't3', name: "Loose Leaf", price: 4.00, description: "Assam Black, Silver Needle White, or Peppermint.", image: "pourover.png" }
    ],
    food: [
        { id: 'fd1', name: "Almond Croissant", price: 5.00, description: "Flaky pastry filled with premium almond frangipane.", image: "hero.png" },
        { id: 'fd2', name: "Avocado Toast", price: 9.50, description: "Thick sourdough, smashed avocado, chili flakes, microgreens.", image: "hero.png" }
    ]
};

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(item) {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    saveCart();
    renderCart();
    
    // Optional: open cart automatically when added
    document.querySelector('.cart-sidebar').classList.add('open');
    document.querySelector('.cart-overlay').classList.add('visible');
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    renderCart();
}

function renderCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems) return; // fail safe if HTML isn't updated yet

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.innerText = totalQty;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; padding: 2rem 0; color: #777;">Your cart is currently empty.</p>';
        cartTotal.innerText = '$0.00';
        return;
    }

    let html = '';
    let totalValue = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        totalValue += itemTotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.qty}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="updateQty('${item.id}', 1)">+</button>
                </div>
            </div>
        `;
    });
    cartItems.innerHTML = html;
    cartTotal.innerText = '$' + totalValue.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
    // Cart Toggle
    const cartIcon = document.getElementById('cart-toggle');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');

    function toggleCart() {
        if(cartSidebar) cartSidebar.classList.toggle('open');
        if(cartOverlay) cartOverlay.classList.toggle('visible');
    }

    if(cartIcon) cartIcon.addEventListener('click', toggleCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Initial Cart Render
    renderCart();

    // Mobile Navigation Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('open');
        });
    }

    // Close mobile menu on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if(mobileMenuBtn) mobileMenuBtn.classList.remove('open');
        }
    });

    // Menu Category Switching logic
    const categoryBtns = document.querySelectorAll('.category-tab');
    const menuGrid = document.getElementById('menu-grid');

    function renderMenuContent(category) {
        if (!menuGrid) return;
        menuGrid.style.opacity = '0';
        
        setTimeout(() => {
            menuGrid.innerHTML = '';
            const items = menuData[category];
            items.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-card';
                menuItem.innerHTML = `
                    <div class="menu-card-img" style="background-image: url('${item.image}')"></div>
                    <div class="menu-card-content">
                        <div class="menu-item-top">
                            <h4 class="menu-item-name">${item.name}</h4>
                            <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                        </div>
                        <p class="menu-item-desc">${item.description}</p>
                        <button class="btn btn-primary sm-btn" onclick='addToCart(${JSON.stringify(item)})'>Add to Cart</button>
                    </div>
                `;
                menuGrid.appendChild(menuItem);
            });
            menuGrid.style.opacity = '1';
        }, 300);
    }

    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderMenuContent(btn.dataset.category);
            });
        });

        // Initialize menu
        renderMenuContent('espresso');
    }

    // Scroll Animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Checkout button alert
    const checkoutBtn = document.getElementById('checkout-btn');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if(cart.length === 0) {
                alert("Your cart is empty!");
            } else {
                alert("Proceeding to checkout for " + cart.length + " items!");
            }
        });
    }
});
