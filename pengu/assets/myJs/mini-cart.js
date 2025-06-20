const cart = JSON.parse(localStorage.getItem("cart")) || [];
const miniCartItemsContainer = document.querySelector(".mini-cart-items");

function fetchProduct(id) {
  return fetch(`https://fakestoreapi.com/products/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    })
    .catch((err) => {
      console.error(`Error fetching product with ID ${id}:`, err);
      return null;
    });
}

function renderMiniCart() {
  if (!miniCartItemsContainer) return;

  let subtotal = 0;
  let html = "";
  let completed = 0;
  const itemsToRender = cart.slice(0, 4);

  itemsToRender.forEach((item, index) => {
    fetchProduct(item.id).then((product) => {
      if (product) {
        const quantity = Number(item.quantity || item.qty) || 0;
        const price = Number(product.price) || 0;
        const itemTotal = price * quantity;
        subtotal += itemTotal;

        html += `
          <div class="mini-cart-item clearfix">
            <div class="mini-cart-item-image">
              <a href="shop.html">
                <img src="${product.image}" alt="${product.title}" width="50" />
              </a>
            </div>
            <div class="mini-cart-item-des">
              <a href="shop.html">${product.title}</a>
              <span class="mini-cart-item-price">$${price.toFixed(
                2
              )} x ${quantity}</span>
              <span class="mini-cart-item-quantity">
                <a href="#"><i class="ti-close"></i></a>
              </span>
            </div>
          </div>
        `;
      }

      completed++;
      if (completed === itemsToRender.length) {
        miniCartItemsContainer.innerHTML = html;

        if (cart.length > 4) {
          miniCartItemsContainer.innerHTML += `<p class="mini-cart-extra-info">+${
            cart.length - 4
          } more item(s) in cart</p>`;
        }

        const subtotalSpan = document.querySelector(
          ".mini-checkout-price span"
        );
        if (subtotalSpan) {
          subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
        }
      }
    });
  });
}

renderMiniCart();
