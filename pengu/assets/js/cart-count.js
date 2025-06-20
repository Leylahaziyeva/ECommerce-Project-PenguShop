document.addEventListener("DOMContentLoaded", () => {
  const cartCountElements = document.querySelectorAll(".cart-count");

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  let totalCount = 0;

  cartItems.forEach((item) => {
    totalCount += item.qty || item.quantity || 0;
  });

  cartCountElements.forEach((el) => {
    el.textContent = totalCount;
  });
});
