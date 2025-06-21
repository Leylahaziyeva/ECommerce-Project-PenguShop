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
  <button
    class="quickview-btn"
    title="Quick View"
    data-bs-toggle="modal"
    data-bs-target="#popup-quickview"
    data-product='${JSON.stringify(p).replace(/'/g, "&apos;")}'
  >
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

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".quickview-btn");
  if (btn) {
    const productData = btn
      .getAttribute("data-product")
      ?.replace(/&apos;/g, "'");
    const product = JSON.parse(productData);
    showQuickView(product);
  }
});

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    "<li>"
      .repeat(fullStars)
      .replace(/li>/g, 'i class="fa fa-star" aria-hidden="true"></i></li>') +
    (halfStar
      ? '<li><i class="fa fa-star-half-o" aria-hidden="true"></i></li>'
      : "") +
    "<li>"
      .repeat(emptyStars)
      .replace(/li>/g, 'i class="fa fa-star-o" aria-hidden="true"></i></li>')
  );
}

function showQuickView(product) {
  const modal = document.querySelector("#popup-quickview");
  modal.querySelector(".quickview-image").src = product.image;
  modal.querySelector(".product-single-content h5").textContent = product.title;
  modal.querySelector(
    ".product-single-content h6"
  ).textContent = `$${product.price}`;
  modal.querySelector(".product-single-content p").textContent =
    product.description;
  modal.querySelector(".product-single-content .rating").innerHTML =
    generateStars(product.rating?.rate || 0);
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
