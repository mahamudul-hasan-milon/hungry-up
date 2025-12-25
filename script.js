// Enhanced Food Data with more items
const foodData = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 12.99,
    originalPrice: 15.99,
    category: "pizza",
    image: "img/food/p1.jpg",
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
    rating: 4.8,
    featured: true,
    discount: 20,
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    price: 14.99,
    originalPrice: 17.99,
    category: "pizza",
    image: "img/food/p2.jpg",
    description: "Loaded with spicy pepperoni and extra cheese",
    rating: 4.9,
    featured: true,
    discount: 15,
  },
  {
    id: 3,
    name: "BBQ Chicken Pizza",
    price: 16.99,
    category: "pizza",
    image: "img/food/p3.jpg",
    description: "Grilled chicken with BBQ sauce and red onions",
    rating: 4.7,
    featured: false,
    discount: 0,
  },
  {
    id: 4,
    name: "Cheeseburger",
    price: 9.99,
    originalPrice: 11.99,
    category: "burger",
    image: "img/food/b1.jpg",
    description: "Juicy beef patty with cheese, lettuce, and special sauce",
    rating: 4.6,
    featured: true,
    discount: 10,
  },
  {
    id: 5,
    name: "Chicken Burger",
    price: 10.99,
    category: "burger",
    image: "img/food/b2.jpg",
    description: "Crispy chicken fillet with mayo and fresh veggies",
    rating: 4.5,
    featured: false,
    discount: 0,
  },
  {
    id: 6,
    name: "Bacon Burger",
    price: 11.99,
    category: "burger",
    image: "img/food/b3.jpg",
    description: "Double patty with crispy bacon and cheddar",
    rating: 4.8,
    featured: false,
    discount: 0,
  },
  {
    id: 7,
    name: "Club Sandwich",
    price: 8.99,
    originalPrice: 10.99,
    category: "sandwich",
    image: "img/food/s1.jpg",
    description: "Triple-decker with turkey, bacon, and avocado",
    rating: 4.4,
    featured: true,
    discount: 15,
  },
  {
    id: 8,
    name: "Veggie Sandwich",
    price: 7.99,
    category: "sandwich",
    image: "img/food/s2.jpg",
    description: "Fresh vegetables with hummus and sprouts",
    rating: 4.3,
    featured: false,
    discount: 0,
  },
  {
    id: 9,
    name: "Chicken Wrap",
    price: 9.49,
    category: "sandwich",
    image: "img/food/s3.jpg",
    description: "Grilled chicken wrap with veggies and ranch",
    rating: 4.6,
    featured: false,
    discount: 0,
  },
];

// Cart array
let cart = [];

// Favorites array
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// DOM Elements
const cartLink = document.getElementById("cartLink");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.querySelector(".cart-count");
const featuredFoods = document.getElementById("featuredFoods");
const checkoutBtn = document.getElementById("checkoutBtn");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const header = document.querySelector("header");

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  loadCartFromLocalStorage();
  updateCartUI();

  // Initialize based on current page
  if (document.querySelector(".hero")) {
    displayFeaturedFoods();
    setupSmoothScrolling();
  }

  if (document.querySelector(".menu-page")) {
    displayMenuFoods();
    setupFilterButtons();
  }

  if (document.querySelector(".contact-page")) {
    setupContactForm();
  }

  // Common event listeners
  setupCommonEventListeners();
  setupHeaderScroll();
});

// Setup common event listeners
function setupCommonEventListeners() {
  if (cartLink) {
    cartLink.addEventListener("click", function (e) {
      e.preventDefault();
      openCart();
    });
  }

  if (closeCart) {
    closeCart.addEventListener("click", closeCartModal);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", checkout);
  }

  // Mobile menu toggle
  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu);
  }

  // Close cart when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === cartModal) {
      closeCartModal();
    }
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

// Setup header scroll effect
function setupHeaderScroll() {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// Setup smooth scrolling
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });
}

// Display featured foods
function displayFeaturedFoods() {
  if (!featuredFoods) return;

  featuredFoods.innerHTML = "";

  // Get featured items
  const featuredItems = foodData.filter((food) => food.featured);

  featuredItems.forEach((food) => {
    const foodCard = createFoodCard(food);
    featuredFoods.appendChild(foodCard);
  });
}

// Display menu foods
function displayMenuFoods(category = "all") {
  const menuFoods = document.getElementById("menuFoods");
  if (!menuFoods) return;

  menuFoods.innerHTML = "";

  const filteredFoods =
    category === "all"
      ? foodData
      : foodData.filter((food) => food.category === category);

  filteredFoods.forEach((food) => {
    const foodCard = createFoodCard(food);
    menuFoods.appendChild(foodCard);
  });
}

// Create food card element
function createFoodCard(food) {
  const isFavorite = favorites.includes(food.id);
  const foodCard = document.createElement("div");
  foodCard.className = "food-card";
  foodCard.innerHTML = `
        ${food.discount ? `<div class="discount">-${food.discount}%</div>` : ""}
        <div class="favorite ${isFavorite ? "active" : ""}" data-id="${
    food.id
  }">
            <i class="fas fa-heart"></i>
        </div>
        <img src="${food.image}" alt="${food.name}" loading="lazy">
        <div class="food-info">
            <h3>${food.name}</h3>
            <p>${food.description}</p>
            <div class="rating">
                ${generateStarRating(food.rating)}
                <span>${food.rating}</span>
            </div>
            <div class="price">
                <div>
                    ${
                      food.originalPrice
                        ? `<del>$${food.originalPrice.toFixed(2)}</del>`
                        : ""
                    }
                    <span>$${food.price.toFixed(2)}</span>
                </div>
                <button class="add-to-cart" data-id="${food.id}">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `;

  // Add event listeners
  const addToCartBtn = foodCard.querySelector(".add-to-cart");
  addToCartBtn.addEventListener("click", function () {
    const foodId = parseInt(this.getAttribute("data-id"));
    addToCart(foodId);
  });

  const favoriteBtn = foodCard.querySelector(".favorite");
  favoriteBtn.addEventListener("click", function () {
    const foodId = parseInt(this.getAttribute("data-id"));
    toggleFavorite(foodId, this);
  });

  return foodCard;
}

// Generate star rating HTML
function generateStarRating(rating) {
  let stars = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += '<i class="fas fa-star"></i>';
    } else if (i === fullStars && hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }

  return stars;
}

// Toggle favorite
function toggleFavorite(foodId, element) {
  const index = favorites.indexOf(foodId);

  if (index === -1) {
    favorites.push(foodId);
    element.classList.add("active");
    showToast("Added to favorites!", "success");
  } else {
    favorites.splice(index, 1);
    element.classList.remove("active");
    showToast("Removed from favorites!", "error");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Add item to cart
function addToCart(foodId) {
  const food = foodData.find((item) => item.id === foodId);

  if (!food) return;

  // Check if item already in cart
  const existingItem = cart.find((item) => item.id === foodId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
      quantity: 1,
    });
  }

  saveCartToLocalStorage();
  updateCartUI();

  // Show toast notification
  showToast(`${food.name} added to cart!`, "success");

  // Animate cart icon
  animateCartIcon();
}

// Remove item from cart
function removeFromCart(foodId) {
  cart = cart.filter((item) => item.id !== foodId);
  saveCartToLocalStorage();
  updateCartUI();
  showToast("Item removed from cart!", "error");
}

// Update item quantity
function updateQuantity(foodId, change) {
  const item = cart.find((item) => item.id === foodId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(foodId);
  } else {
    saveCartToLocalStorage();
    updateCartUI();
  }
}

// Update cart UI
function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  // Update cart modal
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="menu.html" class="btn-primary" onclick="closeCartModal()">Browse Menu</a>
                </div>
            `;
      cartTotal.textContent = "0.00";
      return;
    }

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p class="item-price">$${item.price.toFixed(2)} each</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn minus" data-id="${
                      item.id
                    }">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${
                      item.id
                    }">+</button>
                </div>
                <p class="item-total">$${itemTotal.toFixed(2)}</p>
                <button class="remove-item" data-id="${
                  item.id
                }" title="Remove item">×</button>
            `;

      cartItems.appendChild(cartItem);
    });

    if (cartTotal) {
      cartTotal.textContent = total.toFixed(2);
    }

    // Add event listeners to cart buttons
    document.querySelectorAll(".quantity-btn.minus").forEach((button) => {
      button.addEventListener("click", function () {
        const foodId = parseInt(this.getAttribute("data-id"));
        updateQuantity(foodId, -1);
      });
    });

    document.querySelectorAll(".quantity-btn.plus").forEach((button) => {
      button.addEventListener("click", function () {
        const foodId = parseInt(this.getAttribute("data-id"));
        updateQuantity(foodId, 1);
      });
    });

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        const foodId = parseInt(this.getAttribute("data-id"));
        removeFromCart(foodId);
      });
    });
  }
}

// Filter functionality for menu page
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get category and display foods
      const category = this.getAttribute("data-category");
      displayMenuFoods(category);

      // Animate filter change
      const menuFoods = document.getElementById("menuFoods");
      menuFoods.style.opacity = "0.5";
      setTimeout(() => {
        menuFoods.style.opacity = "1";
      }, 300);
    });
  });
}

// Setup contact form
function setupContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Simple validation
    if (!data.name || !data.email || !data.message) {
      showToast("Please fill in all fields!", "error");
      return;
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Save to localStorage
      const messages =
        JSON.parse(localStorage.getItem("contactMessages")) || [];
      messages.push({
        ...data,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("contactMessages", JSON.stringify(messages));

      // Reset form
      contactForm.reset();

      // Show success message
      showToast(
        "Message sent successfully! We'll get back to you soon.",
        "success"
      );

      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

// Open cart modal
function openCart() {
  cartModal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

// Close cart modal
function closeCartModal() {
  cartModal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Toggle mobile menu
function toggleMobileMenu() {
  navLinks.classList.toggle("active");
  hamburger.innerHTML = navLinks.classList.contains("active")
    ? '<i class="fas fa-times"></i>'
    : '<i class="fas fa-bars"></i>';
}

// Checkout function
function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }

  // Save order to localStorage
  const order = {
    id: Date.now(),
    items: [...cart],
    total: parseFloat(cartTotal.textContent),
    timestamp: new Date().toISOString(),
    status: "pending",
  };

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Generate bill preview
  generateBillPreview(order);

  // Clear cart
  cart = [];
  saveCartToLocalStorage();
  updateCartUI();
  closeCartModal();
}

// Generate bill preview
function generateBillPreview(order) {
  let billContent = `
===========================================
            HUNGRY UP RESTAURANT
          ORDER CONFIRMATION & BILL
===========================================

Order ID: #${order.id}
Date: ${new Date(order.timestamp).toLocaleString()}

-------------------------------------------
ITEM                     QTY   PRICE   TOTAL
-------------------------------------------
`;

  order.items.forEach((item) => {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    const name = item.name.padEnd(25, " ");
    const qty = item.quantity.toString().padStart(3, " ");
    const price = `$${item.price.toFixed(2)}`.padStart(8, " ");
    const total = `$${itemTotal}`.padStart(10, " ");

    billContent += `${name}${qty}${price}${total}\n`;
  });

  billContent += `
-------------------------------------------
Subtotal:                    $${(order.total * 0.9).toFixed(2)}
Tax (10%):                   $${(order.total * 0.1).toFixed(2)}
-------------------------------------------
TOTAL:                       $${order.total.toFixed(2)}
===========================================

Thank you for your order!
Your food will be delivered in 30-45 minutes.

Contact: +8801773593797
Address: Love Road, Mirpur, Dhaka
===========================================
`;

  showBillPreview(billContent, order);
}

// Show bill preview modal
function showBillPreview(billContent, order) {
  const billModal = document.createElement("div");
  billModal.id = "billModal";
  billModal.className = "cart-modal";
  billModal.innerHTML = `
        <div class="cart-content" style="max-width: 700px;">
            <div class="cart-header">
                <h2><i class="fas fa-receipt"></i> Order Confirmation</h2>
                <span class="close-btn" id="closeBill">&times;</span>
            </div>
            <div class="cart-body" style="padding: 20px;">
                <div class="order-success">
                    <i class="fas fa-check-circle" style="color: #2ed573; font-size: 60px; margin-bottom: 20px;"></i>
                    <h3 style="color: #2ed573; margin-bottom: 10px;">Order Successful!</h3>
                    <p style="margin-bottom: 20px;">Your order #${order.id} has been placed successfully.</p>
                </div>
                <div id="billPreview" style="white-space: pre-wrap; font-family: 'Courier New', monospace; background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; max-height: 400px; overflow-y: auto; font-size: 14px; line-height: 1.5;">
                    ${billContent}
                </div>
                <div class="cart-footer" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn-primary" id="printBill" style="background: var(--secondary-color);">
                        <i class="fas fa-print"></i> Print Bill
                    </button>
                    <button class="btn-primary" id="downloadTxt" style="background: var(--success-color);">
                        <i class="fas fa-download"></i> Download TXT
                    </button>
                    <button class="btn-primary" id="closeBillBtn">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(billModal);
  billModal.style.display = "flex";

  // Add event listeners
  document.getElementById("closeBill").addEventListener("click", () => {
    billModal.remove();
  });

  document.getElementById("closeBillBtn").addEventListener("click", () => {
    billModal.remove();
  });

  document.getElementById("printBill").addEventListener("click", () => {
    printBill(billContent);
  });

  document.getElementById("downloadTxt").addEventListener("click", () => {
    downloadBillAsTxt(billContent, order);
  });

  // Close modal when clicking outside
  billModal.addEventListener("click", function (event) {
    if (event.target === billModal) {
      billModal.remove();
    }
  });
}

// Print bill
function printBill(billContent) {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
        <html>
        <head>
            <title>Hungry Up - Bill</title>
            <style>
                body { 
                    font-family: 'Courier New', monospace; 
                    margin: 20px; 
                    line-height: 1.5;
                }
                pre { white-space: pre-wrap; }
                @media print {
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            <pre>${billContent}</pre>
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(() => window.close(), 1000);
                }
            </script>
        </body>
        </html>
    `);
  printWindow.document.close();
}

// Download bill as TXT
function downloadBillAsTxt(billContent, order) {
  const blob = new Blob([billContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hungry-up-order-${order.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Bill downloaded successfully!", "success");
}

// Show toast notification
function showToast(message, type = "success") {
  // Remove existing toast
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  // Create new toast
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
        <i class="fas fa-${
          type === "success" ? "check-circle" : "exclamation-circle"
        }"></i>
        <span>${message}</span>
    `;

  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Animate cart icon
function animateCartIcon() {
  const cartIcon = document.querySelector(".cart-count");
  if (cartIcon) {
    cartIcon.style.transform = "scale(1.3)";
    setTimeout(() => {
      cartIcon.style.transform = "scale(1)";
    }, 300);
  }
}

// Save cart to localStorage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Initialize menu page
if (document.querySelector(".menu-page")) {
  document.addEventListener("DOMContentLoaded", function () {
    loadCartFromLocalStorage();
    updateCartUI();
    displayMenuFoods();
    setupFilterButtons();
  });
}

// Initialize about page
if (document.querySelector(".about-page")) {
  document.addEventListener("DOMContentLoaded", function () {
    loadCartFromLocalStorage();
    updateCartUI();
    setupStatsCounter();
  });
}

// Initialize contact page
if (document.querySelector(".contact-page")) {
  document.addEventListener("DOMContentLoaded", function () {
    loadCartFromLocalStorage();
    updateCartUI();
    setupContactForm();
  });
}

// Setup stats counter animation
function setupStatsCounter() {
  const statItems = document.querySelectorAll(".stat-item h3");
  statItems.forEach((stat) => {
    const target = parseInt(stat.textContent);
    let current = 0;
    const increment = target / 50;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      stat.textContent = Math.floor(current);
    }, 30);
  });
}
