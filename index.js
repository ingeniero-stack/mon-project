const categoryButtons = document.querySelectorAll('.category-button');
const productsDiv = document.querySelector('.products');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');

let cart = [];

function renderProducts(products) {
  productsDiv.innerHTML = '';
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <p>${product.description}</p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;
    productsDiv.appendChild(productDiv);
  });
}

function fetchProducts(category = '') {
  let url = 'https://fakestoreapi.com/products';
  if (category) {
    url += `/category/${category}`;
  }
  fetch(url)
    .then(response => response.json())
    .then(products => {
      renderProducts(products);
    });
}

function fetchProduct(id) {
  const url = `https://fakestoreapi.com/products/${id}`;
  return fetch(url)
    .then(response => response.json())
    .then(product => product);
}

function updateCart() {
  cartItems.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.title} x ${item.quantity}`;
    cartItems.appendChild(li);
  });
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  cartTotal.textContent = totalPrice.toFixed(2);
}

function addToCart(id) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    fetchProduct(id)
      .then(product => {
        const cartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1
        };
        cart.push(cartItem);
      });
  }
  updateCart();
}

function subtractFromCart(id) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    if (existingItem.quantity === 1) {
      cart = cart.filter(item => item.id !== id);
    } else {
      existingItem.quantity--;
    }
  }
  updateCart();
}

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    fetchProducts(category);
  });
});

productsDiv.addEventListener('click', event => {
  const button = event.target.closest('.add-to-cart');
  if (button) {
    const id = parseInt(button.dataset.id);
    addToCart(id);
  }
});

cartItems.addEventListener('click', event => {
  const button = event.target.closest('.subtract-from-cart');
  if (button) {
    const id = parseInt(button.dataset.id);
    subtractFromCart(id);
  }
});

fetchProducts();
