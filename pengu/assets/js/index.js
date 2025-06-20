document.addEventListener("DOMContentLoaded", () => {
  const pathname = window.location.pathname;

  if (pathname.includes("index.html")) {
    loadHomeProducts();
    loadPopularProducts();
  } else if (pathname.includes("shop.html")) {
    loadShopProducts();
    setupLoadMore();
    setupHeaderSearch();
    setupShopFilterSearch();
    setupFilters();
    setupItemsPerPageDropdown();
  } else if (pathname.includes("product-single.html")) {
    loadSingleProduct();
  }

  updateCartCount();
});

function loadHomeProducts() {
  fetch("https://fakestoreapi.com/products?limit=4")
    .then((res) => res.json())
    .then((data) => {
      const container = document.querySelector("#products");
      if (!container) return;

      container.innerHTML = data
        .map(
          (p) => `
        <div class="col-lg-3 col-md-6 col-12">
          <div class="product-single-item">
            <div class="image">
              <img src="${p.image}" alt="${p.title}" />
              <div class="card-icon">
                <a class="icon" href="#"><i class="fa fa-heart-o" aria-hidden="true"></i></a>
                <a class="icon-active" href="#"><i class="fa fa-heart" aria-hidden="true"></i></a>
              </div>
              <ul class="cart-wrap">
                <li>
                  <a href="#" onclick="addToCart(${
                    p.id
                  })" data-bs-toggle="tooltip" title="Add To Cart">
                    <i class="fi flaticon-shopping-cart"></i>
                  </a>
                </li>
                <li>
                  <button data-bs-toggle="tooltip" title="Quick View">
                    <i class="fi ti-eye"></i>
                  </button>
                </li>
              </ul>
              <div class="shop-btn">
                <a class="product-btn" href="product-single.html?id=${
                  p.id
                }">Shop Now</a>
              </div>
            </div>
            <div class="text">
              <h2><a href="product-single.html?id=${p.id}">${p.title}</a></h2>
              <div class="price">
                <del class="old-price">$${(p.price * 1.2).toFixed(2)}</del>
                <span class="present-price">$${p.price}</span>
              </div>
            </div>
          </div>
        </div>
      `
        )
        .join("");
    });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document
    .querySelectorAll(".cart-count")
    .forEach((el) => (el.textContent = count));
}

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Product(s) added to Cart");
}

(function injectProductImageStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
    .product-single-item .image {
      position: relative;
      height: 350px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background-color: #fff;
    }
    .product-single-item .image img {
      height: 100%;
      width: auto;
      object-fit: contain;
    }
  `;
  document.head.appendChild(style);
})();
