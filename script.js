
/* =========================================
   1. PRODUCT DATA
========================================= */

const products = [
  {
    id: 1,
    name: "Classic White Sneakers",
    category: "Fashion",
    price: 1499,
    tag: "Bestseller",
    image: "photo-1542291026-7eec264c27ff"
  },
  {
    id: 2,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 2499,
    tag: "Popular",
    image: "photo-1505740420928-5e560c06d30e"
  },
  {
    id: 3,
    name: "Minimalist Watch",
    category: "Accessories",
    price: 1899,
    tag: "Trending",
    image: "photo-1523275335684-37898b6baf30"
  },
  {
    id: 4,
    name: "Everyday Backpack",
    category: "Lifestyle",
    price: 999,
    tag: "Value Pick",
    image: "photo-1553062407-98eeb64c6a62"
  },
  {
    id: 5,
    name: "Sport Running Shoes",
    category: "Fashion",
    price: 1999,
    tag: "New",
    image: "photo-1542291026-7eec264c27ff"
  },
  {
    id: 6,
    name: "Premium Sunglasses",
    category: "Accessories",
    price: 799,
    tag: "Popular",
    image: "photo-1511499767150-a48a237f0083"
  },
  {
    id: 7,
    name: "Smart Headphones",
    category: "Electronics",
    price: 3299,
    tag: "Featured",
    image: "photo-1505740420928-5e560c06d30e"
  },
  {
    id: 8,
    name: "Travel Backpack",
    category: "Lifestyle",
    price: 1299,
    tag: "Bestseller",
    image: "photo-1622560480654-d96214fdc887"
  }
];


/* =========================================
   2. APPLICATION STATE
========================================= */

let cart = [];
let selectedCategory = "All";
let authMode = "login";


/* =========================================
   3. HTML ELEMENTS
========================================= */

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const productCount = document.getElementById("productCount");
const emptyMessage = document.getElementById("emptyMessage");

const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const overlay = document.getElementById("overlay");

const authOverlay = document.getElementById("authOverlay");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const authSubmit = document.getElementById("authSubmit");
const authName = document.getElementById("authName");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const nameField = document.getElementById("nameField");
const authMessage = document.getElementById("authMessage");
const switchText = document.getElementById("switchText");
const switchAuth = document.getElementById("switchAuth");
const welcomeUser = document.getElementById("welcomeUser");
const accountMessage = document.getElementById("accountMessage");
let accountMessageTimeout;


/* =========================================
   4. FORMAT PRICE
========================================= */

function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}


/* =========================================
   5. PRODUCT IMAGE URL
========================================= */

function getImageUrl(photoId) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&q=80`;
}


/* =========================================
   6. DISPLAY PRODUCTS
========================================= */

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">

      <div class="product-image">
        <img
          src="${getImageUrl(product.image)}"
          alt="${product.name}"
          loading="lazy"
        >

        <span class="product-tag">${product.tag}</span>
      </div>

      <div class="product-info">

        <p class="product-category">${product.category}</p>

        <h3>${product.name}</h3>

        <p class="product-price">
          ${formatPrice(product.price)}
        </p>

        <button
          class="add-btn"
          data-add="${product.id}"
          type="button"
        >
          Add to Cart +
        </button>

      </div>

    </article>
  `).join("");

  productCount.textContent =
    `${filteredProducts.length} products`;

  emptyMessage.hidden = filteredProducts.length !== 0;
}


/* =========================================
   7. ADD PRODUCT TO CART
========================================= */

function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    cart.push({
      ...product,
      quantity: 1
    });
  }

  renderCart();
}


/* =========================================
   8. CHANGE PRODUCT QUANTITY
========================================= */

function changeQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }

  renderCart();
}


/* =========================================
   9. DISPLAY SHOPPING CART
========================================= */

function renderCart() {
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-message">
        Your cart is empty. Start shopping!
      </p>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">

      <div>
        <h3>${item.name}</h3>

        <p>
          ${formatPrice(item.price * item.quantity)}
        </p>
      </div>

      <div class="quantity-controls">

        <button
          data-change="${item.id}"
          data-delta="-1"
          type="button"
          aria-label="Decrease quantity"
        >−</button>

        <span>${item.quantity}</span>

        <button
          data-change="${item.id}"
          data-delta="1"
          type="button"
          aria-label="Increase quantity"
        >+</button>

      </div>

    </div>
  `).join("");
}


/* =========================================
   10. OPEN AND CLOSE CART
========================================= */

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
}

document.getElementById("cartButton").addEventListener(
  "click",
  openCart
);

document.getElementById("closeCart").addEventListener(
  "click",
  closeCart
);

overlay.addEventListener("click", closeCart);


/* =========================================
   11. PRODUCT CLICK EVENTS
========================================= */

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (!button) return;

  addToCart(Number(button.dataset.add));
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-change]");

  if (!button) return;

  changeQuantity(
    Number(button.dataset.change),
    Number(button.dataset.delta)
  );
});


/* =========================================
   12. PRODUCT CATEGORY FILTER
========================================= */

document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;

    document.querySelectorAll(".category").forEach(category => {
      category.classList.toggle(
        "active",
        category === button
      );
    });

    renderProducts();
  });
});


/* =========================================
   13. PRODUCT SEARCH
========================================= */

searchInput.addEventListener("input", renderProducts);

document.getElementById("searchBtn").addEventListener(
  "click",
  renderProducts
);


/* =========================================
   14. SHOP NOW BUTTON
========================================= */

document.getElementById("shopNow").addEventListener("click", () => {
  document.getElementById("productsSection").scrollIntoView({
    behavior: "smooth"
  });
});


/* =========================================
   15. CHECKOUT DEMO
========================================= */

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add a product first.");
    return;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  alert(
    "Welcome to NovaMart Checkout!\n\n" +
    "Total amount: " + formatPrice(total) +
    "\n\nThis is a demo. No payment has been processed."
  );
});


/* =========================================
   16. OPEN LOGIN OR SIGN UP
========================================= */

function openAuth(mode) {
  authMode = mode;

  authForm.reset();
  authMessage.textContent = "";

  updateAuthForm();

  authOverlay.classList.add("show");
}

function closeAuth() {
  authOverlay.classList.remove("show");
}

function showWelcomeUser(name) {
  document.getElementById("loginBtn").hidden = true;
  document.getElementById("signupBtn").hidden = true;
  welcomeUser.textContent = `Hi, ${name}`;
  welcomeUser.hidden = false;
}

function showAccountMessage(message) {
  accountMessage.textContent = message;
  accountMessage.hidden = false;

  window.clearTimeout(accountMessageTimeout);
  accountMessageTimeout = window.setTimeout(() => {
    accountMessage.hidden = true;
  }, 5000);
}

function updateAuthForm() {
  const isSignup = authMode === "signup";

  authTitle.textContent = isSignup
    ? "Create Account"
    : "Welcome Back!";

  authSubtitle.textContent = isSignup
    ? "Join NovaMart and start shopping."
    : "Login to continue shopping.";

  authSubmit.textContent = isSignup
    ? "Create Account"
    : "Login";

  nameField.hidden = !isSignup;
  authName.required = isSignup;

  authPassword.autocomplete = isSignup
    ? "new-password"
    : "current-password";

  switchText.textContent = isSignup
    ? "Already have an account?"
    : "Don't have an account?";

  switchAuth.textContent = isSignup
    ? "Login"
    : "Sign Up";
}


/* =========================================
   17. LOGIN BUTTON
========================================= */

document.getElementById("loginBtn").addEventListener("click", () => {
  openAuth("login");
});


/* =========================================
   18. SIGN UP BUTTON
========================================= */

document.getElementById("signupBtn").addEventListener("click", () => {
  openAuth("signup");
});


/* =========================================
   19. CLOSE AUTHENTICATION POPUP
========================================= */

document.getElementById("authClose").addEventListener(
  "click",
  closeAuth
);

authOverlay.addEventListener("click", event => {
  if (event.target === authOverlay) {
    closeAuth();
  }
});


/* =========================================
   20. SWITCH LOGIN AND SIGN UP
========================================= */

switchAuth.addEventListener("click", () => {
  openAuth(authMode === "login" ? "signup" : "login");
});


/* =========================================
   21. LOGIN AND SIGN UP FORM DEMO
========================================= */

authForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!authForm.reportValidity()) {
    return;
  }

  if (authMode === "signup") {
    const name = authName.value.trim();

    if (!name) {
      authMessage.style.color = "#b42318";
      authMessage.textContent = "Please enter your full name.";
      authName.focus();
      return;
    }

    localStorage.setItem("novamartUserName", name);
    showWelcomeUser(name);
    closeAuth();
    showAccountMessage(`Account created successfully! Welcome, ${name}.`);
  } else {
    authMessage.style.color = "var(--green)";
    authMessage.textContent =
      "Demo only: connect a backend to verify your login.";
  }
});


/* =========================================
   22. START WEBSITE
========================================= */

renderProducts();
renderCart();

const savedUserName = localStorage.getItem("novamartUserName");

if (savedUserName) {
  showWelcomeUser(savedUserName);
}
