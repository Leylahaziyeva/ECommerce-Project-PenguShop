document.addEventListener("DOMContentLoaded", () => {
  showCartTable();
  updateCartCount();
  updateMiniCart();
});

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  updateMiniCart();
  alert("Product(s) added to Cart");
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalCount = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = totalCount;
  });
}

function updateMiniCart() {
  const container = document.getElementById("mini-cart-items");
  if (!container) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    container.innerHTML = "<p>Cart is empty.</p>";
    const subtotalEl = document.querySelector(".mini-checkout-price span");
    if (subtotalEl) subtotalEl.textContent = "$0.00";
    return;
  }

  const fetches = cart
    .slice(0, 4)
    .map((item) =>
      fetch(`https://fakestoreapi.com/products/${item.id}`).then((res) =>
        res.json()
      )
    );

  Promise.all(fetches)
    .then((products) => {
      let html = "";
      let subtotal = 0;

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const item = cart[i];
        const price = Number(product.price) || 0;
        const qty = Number(item.qty) || 0;
        const itemTotal = price * qty;

        subtotal += itemTotal;

        html += `
          <div class="mini-cart-item clearfix" style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="flex-shrink: 0; margin-right: 10px;">
              <a href="product-single.html?id=${product.id}">
                <img src="${product.image}" alt="${
          product.title
        }" style="width: 60px; height: 60px; object-fit: contain;">
              </a>
            </div>
            <div style="flex-grow: 1;">
              <a href="product-single.html?id=${product.id}">${
          product.title
        }</a><br>
              <span>$${price.toFixed(2)} x ${qty} = $${itemTotal.toFixed(
          2
        )}</span>
            </div>
            <div>
              <a href="#" onclick="removeFromCart(${
                item.id
              }); return false;" class="remove-icon" title="Remove from Cart">
                <i class="fi ti-trash"></i>
              </a>
            </div>
          </div>
        `;
      }

      container.innerHTML = html;

      if (cart.length > 4) {
        container.innerHTML += `<p>+${
          cart.length - 4
        } more item(s) in cart</p>`;
      }

      const subtotalEl = document.querySelector(".mini-checkout-price span");
      if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    })
    .catch((err) => {
      console.error("Fetch error in mini cart:", err);
    });
}

function showCartTable() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.querySelector("#cart-body");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `<tr><td colspan="6">Cart is Empty.</td></tr>`;
    updateCartSummary(0, 0);
    return;
  }

  const fetches = cart.map((item) =>
    fetch(`https://fakestoreapi.com/products/${item.id}`).then((res) =>
      res.json()
    )
  );

  Promise.all(fetches)
    .then((products) => {
      let html = "";
      let subtotal = 0;
      let totalQty = 0;

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const item = cart[i];
        const price = Number(product.price) || 0;
        const qty = Number(item.qty) || 0;
        const itemTotal = price * qty;

        subtotal += itemTotal;
        totalQty += qty;

        html += `
          <tr>
            <td class="images"><img src="${product.image}" alt="${
          product.title
        }" width="60"/></td>
            <td class="product">
              <ul>
                <li class="first-cart">${product.title}</li>
              </ul>
            </td>
            <td class="stock">
              <input type="text" value="${qty}" readonly style="width: 40px; text-align: center;" />
            </td>
            <td class="ptice">$${price.toFixed(2)}</td>
            <td class="stock">$${itemTotal.toFixed(2)}</td>
            <td class="action">
              <div class="cart-action-buttons">
                <button type="button" class="qty-btn" onclick="decreaseQuantity(event, ${
                  item.id
                })">-</button>
                <button type="button" class="qty-btn" onclick="increaseQuantity(event, ${
                  item.id
                })">+</button>
                <a href="#" onclick="removeFromCart(${
                  item.id
                }); return false;" title="Remove from Cart" class="remove-icon">
                  <i class="fi ti-trash"></i>
                </a>
              </div>
            </td>
          </tr>
        `;
      }

      container.innerHTML = html;
      updateCartSummary(subtotal, totalQty);
    })
    .catch((error) => {
      console.error("Error loading products for cart table:", error);
    });
}

function updateCartSummary(subtotal, totalQty) {
  const vat = subtotal * 0.05;
  const eco = 100;
  const delivery = 100;
  const grandTotal = subtotal + vat + eco + delivery;

  document.querySelector(".total-count").textContent = `(${totalQty})`;
  document.querySelector(".sub-price").textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector(".vat-price").textContent = `$${vat.toFixed(2)}`;
  document.querySelector(".eco-price").textContent = `$${eco.toFixed(2)}`;
  document.querySelector(".delivery-price").textContent = `$${delivery.toFixed(
    2
  )}`;
  document.querySelector(".total-price").textContent = `$${grandTotal.toFixed(
    2
  )}`;
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  updateMiniCart();
  showCartTable();
}

function decreaseQuantity(event, id) {
  event.preventDefault();
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((i) => i.id === id);
  if (item) {
    if (item.qty > 1) {
      item.qty -= 1;
    } else {
      cart = cart.filter((i) => i.id !== id);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateMiniCart();
    showCartTable();
  }
}

function increaseQuantity(event, id) {
  event.preventDefault();
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateMiniCart();
    showCartTable();
  }
}

const style = document.createElement("style");
style.textContent = `
  .cart-action-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .qty-btn {
    padding: 4px 8px;
    background-color: #ddd;
    border: none;
    cursor: pointer;
    font-size: 14px;
    border-radius: 4px;
  }

  .qty-btn:hover {
    background-color: #ccc;
  }

  .remove-icon {
    color: #333;
    text-decoration: none;
    font-size: 16px;
  }

  .remove-icon:hover {
    color: red;
  }
`;
document.head.appendChild(style);
