let products = [];
let currentView = 'list';
let currentPage = 1;
const itemsPerPage = 5;
let debounceTimer;

const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');
const toggleViewBtn = document.getElementById('toggleView');
const pagination = document.getElementById('pagination');

const modal = document.getElementById('productModal');
const form = document.getElementById('productForm');
const formError = document.getElementById('formError');

document.getElementById('addProductBtn').onclick = () => openModal();
document.getElementById('closeModal').onclick = closeModal;

toggleViewBtn.onclick = () => {
  currentView = currentView === 'list' ? 'card' : 'list';
  toggleViewBtn.textContent = currentView === 'list' ? 'Card View' : 'List View';
  render();
};

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentPage = 1;
    render();
  }, 500);
});

form.onsubmit = (e) => {
  e.preventDefault();
  const id = productId.value;
  const name = nameInput.value.trim();
  const price = priceInput.value;
  const category = categoryInput.value.trim();

  if (!name || !price || !category) {
    formError.textContent = 'Name, Price & Category are required';
    return;
  }

  const data = {
    id: id || Date.now().toString(),
    name,
    price,
    category,
    stock: stockInput.value,
    description: descriptionInput.value
  };

  if (id) {
    products = products.map(p => p.id === id ? data : p);
  } else {
    products.push(data);
  }

  closeModal();
  render();
};

function openModal(product = null) {
  modal.classList.remove('hidden');
  formError.textContent = '';
  form.reset();

  if (product) {
    modalTitle.textContent = 'Edit Product';
    productId.value = product.id;
    nameInput.value = product.name;
    priceInput.value = product.price;
    categoryInput.value = product.category;
    stockInput.value = product.stock;
    descriptionInput.value = product.description;
  } else {
    modalTitle.textContent = 'Add Product';
    productId.value = '';
  }
}

function closeModal() {
  modal.classList.add('hidden');
}

function render() {
  const query = searchInput.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const data = filtered.slice(start, start + itemsPerPage);

  productList.innerHTML = '';

  if (currentView === 'list') {
    const table = document.createElement('table');
    table.innerHTML = `
      <tr><th>Name</th><th>Price</th><th>Category</th><th>Stock</th><th>Action</th></tr>
      ${data.map(p => `
        <tr>
          <td>${p.name}</td>
          <td>${p.price}</td>
          <td>${p.category}</td>
          <td>${p.stock || '-'}</td>
          <td><button onclick="editProduct('${p.id}')">Edit</button></td>
        </tr>
      `).join('')}
    `;
    productList.appendChild(table);
  } else {
    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.innerHTML = data.map(p => `
      <div class="card">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <p>${p.category}</p>
        <button onclick="editProduct('${p.id}')">Edit</button>
      </div>
    `).join('');
    productList.appendChild(grid);
  }

  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === currentPage ? 'active' : '';
    btn.onclick = () => {
      currentPage = i;
      render();
    };
    pagination.appendChild(btn);
  }
}

function editProduct(id) {
  openModal(products.find(p => p.id === id));
}

const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const categoryInput = document.getElementById('category');
const stockInput = document.getElementById('stock');
const descriptionInput = document.getElementById('description');
const productId = document.getElementById('productId');
const modalTitle = document.getElementById('modalTitle');

render();
