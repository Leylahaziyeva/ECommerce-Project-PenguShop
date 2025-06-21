let itemsPerPage = 6;
let shopPage = 1;
let allProducts = [];

function loadShopProducts() {
  fetch(`https://fakestoreapi.com/products?limit=${shopPage * itemsPerPage}`)
    .then((res) => res.json())
    .then((data) => {
      allProducts = data;
      renderProducts(allProducts);
      applyFilters();
    });
}

function renderProducts(products) {
  const container = document.querySelector("#products");
  if (!container) return;

  container.innerHTML = "";

  container.innerHTML = products
    .map(
      (p) => `
      <div class="col-lg-4 col-md-6 col-12">
        <div class="product-single-item" data-category="${p.category.toLowerCase()}">
          <div class="image">
            <img src="${p.image}" alt="${p.title}" />
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

  updateProductCount(products.length);
}

function setupItemsPerPageDropdown() {
  const select = document.querySelector("#items-per-page");
  if (!select) return;

  select.addEventListener("change", (e) => {
    itemsPerPage = parseInt(e.target.value, 10);
    shopPage = 1;
    loadShopProducts();
  });
}

function setupLoadMore() {
  const btn = document.querySelector("#load-more");
  if (btn) {
    btn.addEventListener("click", () => {
      shopPage++;
      loadShopProducts();
    });
  }
}

function setupHeaderSearch() {
  const form = document.querySelector("#header-search-form");
  const input = document.querySelector("#header-search-input");
  if (!form || !input) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = input.value.toLowerCase();
    const products = document.querySelectorAll(".product-single-item");

    products.forEach((product) => {
      const title = product.querySelector("h2").textContent.toLowerCase();
      product.style.display = title.includes(query) ? "block" : "none";
    });
  });
}

function setupShopFilterSearch() {
  const form = document.querySelector("#shop-search-form");
  const input = document.querySelector("#shop-search-input");

  if (!form || !input) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = input.value.trim().toLowerCase();
    const products = document.querySelectorAll(".product-single-item");

    products.forEach((product) => {
      const title = product.querySelector("h2").textContent.toLowerCase();
      product.style.display = title.includes(query) ? "block" : "none";
    });
  });
}

function setupFilters() {
  const priceInputs = document.querySelectorAll("input[name='topcoat']");
  const categoryInputs = document.querySelectorAll("input[name='category']");

  const allInputs = [...priceInputs, ...categoryInputs];

  allInputs.forEach((input) => {
    input.addEventListener("change", applyFilters);
  });
}

function applyFilters() {
  const selectedPrice = document.querySelector("input[name='topcoat']:checked");
  const selectedCategory = document.querySelector(
    "input[name='category']:checked"
  );

  let filtered = [...allProducts];

  if (selectedPrice) {
    const value = selectedPrice.value;

    filtered = filtered.filter((p) => {
      const price = p.price;

      switch (value) {
        case "0-50":
          return price >= 0 && price <= 50;
        case "50-100":
          return price > 50 && price <= 100;
        case "100-300":
          return price > 100 && price <= 300;
        case "300+":
          return price > 300;
        case "all":
        default:
          return true;
      }
    });
  }

  if (selectedCategory) {
    const categoryValue = selectedCategory.value.toLowerCase();
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === categoryValue
    );
  }

  renderProducts(filtered);
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

function updateProductCount(visibleCount) {
  const label = document.querySelector("#product-count-label");
  if (!label) return;

  const total = allProducts.length;
  const from = (shopPage - 1) * itemsPerPage + 1;
  const to = Math.min(shopPage * itemsPerPage, total);

  label.textContent = `Showing Products ${from} - ${to} of ${total} Results`;
}
