document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    alert("No product ID specified in URL");
    return;
  }

  fetch(`https://fakestoreapi.com/products/${id}`)
    .then((res) => res.json())
    .then((product) => {
      document.querySelector(".product-single-content h5").textContent =
        product.title;
      document.querySelector(
        ".product-single-content h6"
      ).textContent = `$${product.price}`;
      document.querySelector(".product-single-content p").textContent =
        product.description;
      document.title = `${product.title} - Pengu`;

      document.querySelectorAll(".product-single-img img").forEach((img) => {
        img.src = product.image;
        img.alt = product.title;
      });

      const ratingContainer = document.querySelector(
        ".product-single-content .rating"
      );
      if (ratingContainer && product.rating) {
        const rate = product.rating.rate;
        const count = product.rating.count;
        const fullStars = Math.floor(rate);
        const halfStar = rate % 1 >= 0.5;
        let starsHTML = "";

        for (let i = 0; i < fullStars; i++) {
          starsHTML += '<li><i class="fa fa-star" aria-hidden="true"></i></li>';
        }
        if (halfStar) {
          starsHTML +=
            '<li><i class="fa fa-star-half-o" aria-hidden="true"></i></li>';
        }
        while (starsHTML.match(/<li>/g)?.length < 5) {
          starsHTML +=
            '<li><i class="fa fa-star-o" aria-hidden="true"></i></li>';
        }

        ratingContainer.innerHTML = starsHTML;

        const ratingInfo = document.createElement("p");
        ratingInfo.textContent = `${rate} / 5 (${count} reviews)`;
        ratingContainer.parentElement.appendChild(ratingInfo);
      }
    })
    .catch((err) => {
      console.error("Failed to load product:", err);
      document.querySelector(
        ".product-single-content"
      ).innerHTML = `<p>Product not found.</p>`;
    });

  const addToCartBtn = document.getElementById("addToCartBtn");
  addToCartBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const quantity = parseInt(document.getElementById("quantity").value);
    if (!id || isNaN(quantity) || quantity <= 0) {
      alert("Please select a valid quantity.");
      return;
    }

    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct = cart.find((item) => item.id == product.id);
        if (existingProduct) {
          existingProduct.qty += quantity;
        } else {
          cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            qty: quantity,
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product(s) added to cart!");
      });
  });
});
