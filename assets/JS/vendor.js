// ==============================
// Função para copiar email ao clicar
// ==============================
function enableEmailCopy() {
  const toast = document.getElementById('toast');

  document.querySelectorAll('.email-copia').forEach(span => {
    span.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(span.dataset.email);

        toast.textContent = `Email copiado: ${span.dataset.email}`;
        toast.classList.add('show');

        setTimeout(() => toast.classList.remove('show'), 2000);

      } catch (err) {
        toast.textContent = 'Erro ao copiar email';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
        console.error(err);
      }
    });
  });
}

// ==============================
// Função utilitária para embaralhar array
// ==============================
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ==============================
// Função para criar esteira aleatória da categoria (sem repetir o vendor atual)
// ==============================
function createEsteiraFromCategory(data, type, maxItems = 5, currentVendorName = '') {
  const track = document.querySelector('.esteira-track');
  if (!track) return;
  track.innerHTML = '';

  // Filtra para não incluir o vendor atual
  const vendors = data[type].filter(v => v.name.toLowerCase() !== currentVendorName.toLowerCase());

  if (!vendors || vendors.length === 0) return;

  // Embaralha e seleciona até maxItems
  const randomVendors = shuffleArray(vendors).slice(0, maxItems);

  // Cria os elementos da esteira
  randomVendors.forEach(vendor => {
    const a = document.createElement('a');
    a.href = vendor.link || '#';
    a.className = 'logo-card me-3';
    const img = document.createElement('img');
    img.src = vendor.logo;
    img.alt = vendor.name;
    a.appendChild(img);
    track.appendChild(a);
  });
}

// ==============================
// Função para criar produtos
// ==============================
function createProducts(products) {
  const grid = document.querySelector('.vendor-content .grid');
  if (!grid) return;
  grid.innerHTML = '';
  products.forEach(prod => {
    const col = document.createElement('div');
    col.className = 'card p-3';
    col.innerHTML = `
      <div class="logo-placeholder text-center mb-2">
        <img src="${prod.logo}" alt="${prod.title}" class="img-fluid">
      </div>
      <h3>${prod.title}</h3>
      <p>${prod.description}</p>
    `;
    grid.appendChild(col);
  });
}

// ==============================
// Função para criar tags
// ==============================
function createTags(tags) {
  const container = document.querySelector('.tag-list');
  if (!container) return;
  container.innerHTML = '';
  tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    container.appendChild(span);
  });
}

// ==============================
// Função para criar concorrentes
// ==============================
function createCompetitors(competitors) {
  const ul = document.querySelector('.vendor-section ul.inline-list');
  if (!ul) return;
  ul.innerHTML = '';
  competitors.forEach(c => {
    const li = document.createElement('li');
    li.className = 'list-inline-item me-3';
    li.textContent = c;
    ul.appendChild(li);
  });
}

// ==============================
// Função para criar perfil de clientes
// ==============================
function createProfiles(profile) {
  const container = document.querySelector('.profile-grid');
  if (!container) return;
  container.innerHTML = '';

  const mapping = {
    'segments': 'Segmentos',
    'sizes': 'Porte',
    'roles': 'Perfis'
  };

  for (const key in profile) {
    const div = document.createElement('div');
    div.innerHTML = `<h4>${mapping[key] || key}</h4><ul>${profile[key].map(item => `<li>${item}</li>`).join('')}</ul>`;
    container.appendChild(div);
  }
}

// ==============================
// Função para criar contatos (sidebar)
// ==============================
function createContacts(contacts) {
  const container = document.querySelector('.contact-card');
  if (!container) return;
  container.innerHTML = '';
  contacts.forEach(contact => {
    container.innerHTML += `
      <h4>${contact.name}</h4>
      <p>${contact.role || ''}</p>
      <span class="email-copia" data-email="${contact.email}">${contact.email}</span>
    `;
  });
  enableEmailCopy();
}

// ==============================
// Função principal para carregar os dados
// ==============================
async function loadVendorData() {
  try {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type') || 'security'; // categoria
    const name = params.get('name');               // fornecedor específico (opcional)

    const res = await fetch('./assets/JSON/vendors.json');
    const data = await res.json();

    if (!data[type]) throw new Error(`Tipo "${type}" não encontrado no JSON.`);

    let vendor;
    if (name) {
      vendor = data[type].find(v => v.name.toLowerCase() === name.toLowerCase());
      if (!vendor) throw new Error(`Fornecedor "${name}" não encontrado em "${type}".`);
    } else {
      vendor = data[type][0]; // pega o primeiro por padrão
    }

    // Atualiza título e descrição do topo
    document.title = `${vendor.name} | Adistec Brasil`;
    document.getElementById('page-title').textContent = vendor.name;
    document.getElementById('page-description').textContent = vendor.description || '';

    // ==============================
    // Esteira: agora aleatória da categoria inteira
    // ==============================
    createEsteiraFromCategory(data, type, 5, vendor.name);

    // Popula produtos
    if (vendor.products) createProducts(vendor.products);

    // Popula tags
    if (vendor.tags) createTags(vendor.tags);

    // Popula concorrentes
    if (vendor.competitors) createCompetitors(vendor.competitors);

    // Popula perfil de clientes
    if (vendor.profile) createProfiles(vendor.profile);

    // Popula contatos
    if (vendor.contacts) createContacts(vendor.contacts);

    // Vendor description
    const descEl = document.getElementById('vendor-description');
    if (descEl && vendor.description) descEl.textContent = vendor.description;

  } catch (err) {
    console.error('Erro ao carregar dados:', err);
    alert(err.message);
  }
}

// ==============================
// Chama função principal
// ==============================
loadVendorData();
