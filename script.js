
const SHOP_PHONE = "2348165967407";

const products = [
  {
    id: 1, name: "Elegant Women's Outfit", category: "Fashion",
    price: 18000, description: "A stylish outfit for outings and occasions.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2, name: "Classic Fashion Dress", category: "Fashion",
    price: 15000, description: "A lovely dress for everyday wear.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3, name: "Casual Fashion Wear", category: "Fashion",
    price: 12000, description: "Comfortable clothing for your wardrobe.",
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4, name: "Everyday Provisions Pack", category: "Provisions",
    price: 8500, description: "A sample bundle of household essentials.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5, name: "Groceries & Essentials", category: "Provisions",
    price: 5000, description: "Useful everyday shopping essentials.",
    image: "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6, name: "Snack Assortment", category: "Provisions",
    price: 3500, description: "A sample selection of snacks and treats.",
    image: "https://images.unsplash.com/photo-1621939514649-280e2aa2f7a7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7, name: "Soft Drinks Pack", category: "Drinks",
    price: 4500, description: "A sample pack of assorted soft drinks.",
    image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8, name: "Bottled Water Pack", category: "Drinks",
    price: 2500, description: "Bottled water for home and events.",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9, name: "Refreshing Juice", category: "Drinks",
    price: 1800, description: "A sample juice product listing.",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10, name: "Event Chairs Rental", category: "Rentals",
    price: 500, description: "Example price per chair, per event. Confirm availability.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
    rental: true, unit: "chair / event"
  },
  {
    id: 11, name: "Event Table Rental", category: "Rentals",
    price: 2500, description: "Example price per table. Confirm dates and quantity.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
    rental: true, unit: "table / event"
  },
  {
    id: 12, name: "Party Canopy Rental", category: "Rentals",
    price: 25000, description: "Example rental price. Ask about size and availability.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
    rental: true, unit: "canopy / event"
  }
];

const $ = (selector) => document.querySelector(selector);

let activeCategory = "All";
let searchTerm = "";
let cart = loadStorage("omoolaCart", []);
let orders = loadStorage("omoolaOrders", []);
let toastTimer;

function loadStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    showToast("Browser storage is unavailable. Please check your settings.");
    return false;
  }
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openOverlay(id) {
  $("#" + id).classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeOverlay(id) {
  $("#" + id).classList.add("hidden");

  if (!document.querySelector(".overlay:not(.hidden)")) {
    document.body.style.overflow = "";
  }
}

function getProduct(id) {
  return products.find(product => product.id === Number(id));
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function renderProducts() {
  let filtered = products.filter(product => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    const text = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const sort = $("#sortSelect").value;

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

  $("#sectionTitle").textContent =
    activeCategory === "All" ? "Shop our collection" : activeCategory;

  $("#productGrid").innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image" data-details="${product.id}" tabindex="0" role="button" aria-label="View ${escapeHTML(product.name)}">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
        <span class="product-badge">${escapeHTML(product.category)}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${escapeHTML(product.category)}</span>
        <h3>${escapeHTML(product.name)}</h3>
        <p class="product-description">${escapeHTML(product.description)}</p>
        <div class="product-bottom">
          <div>
            <div class="price">${formatMoney(product.price)}</div>
            ${product.rental ? `<div class="old-price">Example rental rate</div>` : ""}
          </div>
          <button class="add-button" data-add="${product.id}">
            ${product.rental ? "Enquire" : "+ Add"}
          </button>
        </div>
      </div>
    </article>
  `).join("");

  $("#emptyProducts").classList.toggle("hidden", filtered.length > 0);
}

function addToCart(id) {
  const product = getProduct(id);
  if (!product) return;

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: product.id, quantity: 1 });
  }

  if (!saveStorage("omoolaCart", cart)) return;

  renderCart();
  showToast(product.rental
    ? "Added. Please confirm rental details at checkout."
    : `${product.name} added to your cart.`);
}

function changeQuantity(id, amount) {
  const item = cart.find(item => item.id === Number(id));
  if (!item) return;

  item.quantity += amount;
  cart = cart.filter(item => item.quantity > 0);

  if (!saveStorage("omoolaCart", cart)) return;
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== Number(id));
  if (!saveStorage("omoolaCart", cart)) return;
  renderCart();
  showToast("Item removed from cart.");
}

function renderCart() {
  $("#cartCount").textContent = cart.reduce(
    (total, item) => total + item.quantity, 0
  );

  $("#cartSubtotal").textContent = formatMoney(getCartTotal());
  $("#checkoutTotal").textContent = formatMoney(getCartTotal());

  if (!cart.length) {
    $("#cartItems").innerHTML = `
      <div class="empty-cart">
        <div style="font-size:42px">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Have a look around and add something you like.</p>
      </div>`;
    $("#checkoutButton").disabled = true;
    return;
  }

  $("#checkoutButton").disabled = false;

  $("#cartItems").innerHTML = cart.map(item => {
    const product = getProduct(item.id);
    if (!product) return "";

    return `
      <div class="cart-item">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}">
        <div>
          <h3>${escapeHTML(product.name)}</h3>
          <p>${formatMoney(product.price)}${product.rental ? " / unit" : ""}</p>
          <div class="quantity-controls">
            <button data-quantity="${product.id}" data-change="-1" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button data-quantity="${product.id}" data-change="1" aria-label="Increase quantity">+</button>
          </div>
          <button class="remove-button" data-remove="${product.id}">Remove</button>
        </div>
        <strong>${formatMoney(product.price * item.quantity)}</strong>
      </div>`;
  }).join("");
}

function showProductDetails(id) {
  const product = getProduct(id);
  if (!product) return;

  $("#detailTitle").textContent = product.name;

  $("#detailContent").innerHTML = `
    <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}"
      style="width:100%;height:240px;object-fit:cover;border-radius:8px;margin-bottom:18px">
    <span class="product-category">${escapeHTML(product.category)}</span>
    <h2>${escapeHTML(product.name)}</h2>
    <p>${escapeHTML(product.description)}</p>
    <p class="price">${formatMoney(product.price)}${product.rental ? " / unit" : ""}</p>
    ${product.rental ? `
      <p class="muted">This is an example price, not a confirmed quote. Confirm the event date, rental duration, quantity and availability with the shop.</p>
      <label style="display:grid;gap:6px;margin-bottom:15px">
        Event date
        <input id="rentalDate" type="date" min="${new Date().toLocaleDateString("en-CA")}"
          style="padding:10px;border:1px solid #ddd;border-radius:5px">
      </label>
      <label style="display:grid;gap:6px;margin-bottom:15px">
        Rental details
        <textarea id="rentalNotes" rows="3" maxlength="500"
          placeholder="Event location, quantity, duration..."
          style="padding:10px;border:1px solid #ddd;border-radius:5px"></textarea>
      </label>` : ""}
    <button class="primary-button full-button" id="detailAddButton">
      ${product.rental ? "Add enquiry to cart" : "Add to Cart"}
    </button>`;

  $("#detailAddButton").addEventListener("click", () => {
    if (product.rental) {
      const date = $("#rentalDate").value;
      const notes = $("#rentalNotes").value.trim();

      if (!date) {
        showToast("Please select your event date.");
        return;
      }

      if (date < new Date().toLocaleDateString("en-CA")) {
        showToast("Please choose a current or future date.");
        return;
      }

      const rental = {
        id: product.id,
        quantity: 1,
        date,
        notes
      };

      const existing = cart.find(item =>
        item.id === rental.id && item.date === rental.date && item.notes === rental.notes
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push(rental);
      }

      if (!saveStorage("omoolaCart", cart)) return;
      renderCart();
      closeOverlay("detailOverlay");
      showToast("Rental enquiry added. Availability will be confirmed.");
    } else {
      addToCart(product.id);
      closeOverlay("detailOverlay");
    }
  });

  openOverlay("detailOverlay");
}

function renderOrders() {
  if (!orders.length) {
    $("#orderHistory").innerHTML = `
      <div class="empty-cart">
        <div style="font-size:40px">📦</div>
        <h3>No orders yet</h3>
        <p>Your orders placed on this browser will appear here.</p>
      </div>`;
    return;
  }

  $("#orderHistory").innerHTML = [...orders].reverse().map(order => `
    <article class="order-card">
      <h3>Order ${escapeHTML(order.number)}</h3>
      <p>${escapeHTML(order.date)}</p>
      <p class="order-status">${escapeHTML(order.status)}</p>
      <p class="order-items">${order.items.map(item =>
        `${escapeHTML(item.name)} × ${item.quantity}${item.rental && item.rentalDate ? ` (Date: ${escapeHTML(item.rentalDate)})` : ""}`
      ).join("<br>")}</p>
      <p><strong>Total: ${formatMoney(order.total)}</strong></p>
      <p class="muted">Contact: ${escapeHTML(order.phone)}</p>
    </article>
  `).join("");
}

function submitOrder(event) {
  event.preventDefault();

  if (!cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  const form = $("#checkoutForm");
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const customerName = String(data.get("customerName")).trim();
  const phone = String(data.get("phone")).trim();
  const address = String(data.get("address")).trim();

  if (!customerName || !phone || !address) {
    showToast("Please complete the required details.");
    return;
  }

  const order = {
    number: "OM" + Date.now().toString().slice(-9),
    date: new Date().toLocaleString(),
    status: "Awaiting shop confirmation",
    customerName,
    phone,
    email: String(data.get("email") || "").trim(),
    address,
    notes: String(data.get("notes") || "").trim(),
    contactMethod: String(data.get("contactMethod")),
    total: getCartTotal(),
    items: cart.map(item => {
      const product = getProduct(item.id);
      return {
        id: item.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        rental: Boolean(product.rental),
        rentalDate: item.date || "",
        rentalNotes: item.notes || ""
      };
    })
  };

  orders.push(order);

  // Save the order before clearing the cart.
  if (!saveStorage("omoolaOrders", orders)) {
    orders.pop();
    return;
  }

  const message = [
    "NEW ORDER - OMOOLA FASHION DESIGN & MORE",
    "",
    `Order number: ${order.number}`,
    `Customer: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Email: ${order.email || "Not provided"}`,
    `Address / pickup: ${order.address}`,
    `Contact preference: ${order.contactMethod}`,
    "",
    "ITEMS:"
  ];

  order.items.forEach(item => {
    message.push(
      `${item.name} x ${item.quantity} - ${formatMoney(item.price * item.quantity)}`
    );
    if (item.rentalDate) message.push(`Event date: ${item.rentalDate}`);
    if (item.rentalNotes) message.push(`Rental details: ${item.rentalNotes}`);
  });

  message.push(
    "",
    `TOTAL: ${formatMoney(order.total)}`,
    `Notes: ${order.notes || "None"}`,
    "",
    "Please confirm product availability, delivery or rental details, and payment instructions."
  );

  const whatsappURL =
    `https://wa.me/${SHOP_PHONE}?text=${encodeURIComponent(message.join("\n"))}`;

  cart = [];

  if (!saveStorage("omoolaCart", cart)) {
    // The order is already saved, so keep the order record.
    showToast("Order saved, but the cart could not be updated.");
  }

  renderCart();
  renderOrders();
  form.reset();

  closeOverlay("checkoutOverlay");
  closeOverlay("cartOverlay");

  showToast("Order saved! Opening WhatsApp to send it to the shop.");

  // WhatsApp requires the customer to send the prepared message.
  window.open(whatsappURL, "_blank", "noopener,noreferrer");
}

$("#searchForm").addEventListener("submit", event => {
  event.preventDefault();
  searchTerm = $("#searchInput").value.trim();
  renderProducts();
  $("#shop").scrollIntoView({ behavior: "smooth" });
});

$("#searchInput").addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderProducts();
});

$("#sortSelect").addEventListener("change", renderProducts);

$(".categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".category").forEach(category => {
    category.classList.toggle("active", category === button);
  });

  renderProducts();
});

$("#productGrid").addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const detailButton = event.target.closest("[data-details]");

  if (addButton) {
    const product = getProduct(addButton.dataset.add);
    if (product?.rental) {
      showProductDetails(product.id);
    } else {
      addToCart(addButton.dataset.add);
    }
  } else if (detailButton) {
    showProductDetails(detailButton.dataset.details);
  }
});

$("#productGrid").addEventListener("keydown", event => {
  const target = event.target.closest("[data-details]");
  if (target && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    showProductDetails(target.dataset.details);
  }
});

$("#cartItems").addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    const id = Number(quantityButton.dataset.quantity);
    const change = Number(quantityButton.dataset.change);

    const item = cart.find(item => item.id === id);
    if (item && change < 0 && item.quantity === 1) {
      removeFromCart(id);
    } else {
      changeQuantity(id, change);
    }
  }

  if (removeButton) removeFromCart(removeButton.dataset.remove);
});

$("#cartButton").addEventListener("click", () => {
  renderCart();
  openOverlay("cartOverlay");
});

$("#ordersButton").addEventListener("click", () => {
  renderOrders();
  openOverlay("ordersOverlay");
});

$("#checkoutButton").addEventListener("click", () => {
  if (!cart.length) return;
  $("#checkoutTotal").textContent = formatMoney(getCartTotal());
  closeOverlay("cartOverlay");
  openOverlay("checkoutOverlay");
});

$("#checkoutForm").addEventListener("submit", submitOrder);

$("#shopNow").addEventListener("click", () => {
  $("#shop").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => closeOverlay(button.dataset.close));
});

document.querySelectorAll(".overlay").forEach(overlay => {
  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeOverlay(overlay.id);
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    document.querySelectorAll(".overlay:not(.hidden)").forEach(overlay => {
      closeOverlay(overlay.id);
    });
  }
});

$("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
renderOrders();
