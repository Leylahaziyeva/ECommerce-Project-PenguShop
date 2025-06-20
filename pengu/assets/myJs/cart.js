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

  let html = "";
  let subtotal = 0;
  let count = 0;

  cart.slice(0, 4).forEach((item, index, array) => {
    fetch(`https://fakestoreapi.com/products/${item.id}`)
      .then((res) => res.json())
      .then((product) => {
        const price = Number(product.price) || 0;
        const qty = Number(item.qty || item.quantity) || 0;
        const total = price * qty;
        subtotal += total;

        html += `
  <div class="mini-cart-item clearfix">
    <div class="mini-cart-item-image">
      <a href="product-single.html?id=${product.id}">
        <img src="${product.image}" alt="${
          product.title
        }" style="width: 60px; height: 60px; object-fit: contain;">
      </a>
    </div>
    <div class="mini-cart-item-des">
      <a href="product-single.html?id=${product.id}">${product.title}</a>
      <span class="mini-cart-item-price">$${price.toFixed(2)} x ${qty}</span>
    </div>
  </div>
`;
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => {
        count++;
        if (count === array.length) {
          container.innerHTML = html;
          if (cart.length > 4) {
            container.innerHTML += `<p>+${
              cart.length - 4
            } more item(s) in cart</p>`;
          }
          const subtotalEl = document.querySelector(
            ".mini-checkout-price span"
          );
          if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        }
      });
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

  let html = "";
  let subtotal = 0;
  let totalQty = 0;
  let count = 0;

  cart.forEach((item) => {
    fetch(`https://fakestoreapi.com/products/${item.id}`)
      .then((res) => res.json())
      .then((product) => {
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
                <li>Brand : N/A</li>
                <li>Size : N/A</li>
              </ul>
            </td>
            <td class="stock">
              <ul class="input-style">
                <li class="quantity cart-plus-minus">
                  <input type="text" value="${qty}" readonly />
                </li>
              </ul>
            </td>
            <td class="ptice">$${price.toFixed(2)}</td>
            <td class="stock">$${itemTotal.toFixed(2)}</td>
            <td class="action">
              <ul>
                <li class="w-btn">
                  <a href="#" onclick="removeFromCart(${
                    item.id
                  }); return false;" title="Remove from Cart">
                    <i class="fi ti-trash"></i>
                  </a>
                </li>
              </ul>
            </td>
          </tr>
        `;
      })
      .catch((error) => {
        console.error("Error loading product for cart table:", error);
      })
      .finally(() => {
        count++;
        if (count === cart.length) {
          container.innerHTML = html;
          updateCartSummary(subtotal, totalQty);
        }
      });
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
  const itemIndex = cart.findIndex((item) => item.id === id);

  if (itemIndex > -1) {
    if (cart[itemIndex].qty > 1) {
      cart[itemIndex].qty -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateMiniCart();
    showCartTable?.();
  }
}
