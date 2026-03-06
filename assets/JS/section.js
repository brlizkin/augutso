let allItems = [];
let allTags = [];
let activeTags = new Set();

const MAX_VISIBLE_TAGS = 20;
let tagsExpanded = false;
let tagSearchTerm = "";

// ============================
// CONTEXTO DA SEÇÃO
// ============================

const params = new URLSearchParams(window.location.search);
const currentSection = params.get("type") || "security";

const sectionContent = {
  security: {
    title: "Security Portfolio",
    description: "Fabricantes líderes em proteção de dados, identidades, aplicações e infraestrutura."
  },
  alliances: {
    title: "Alliances Portfolio",
    description: "Parcerias estratégicas do ecossistema Adistec e fabricantes complementares."
  },
  datacenter: {
    title: "Data Center Portfolio",
    description: "Infraestrutura corporativa, servidores, storage e soluções HCI."
  }
};

if (sectionContent[currentSection]) {
  document.getElementById("page-title").innerText = sectionContent[currentSection].title;
  document.getElementById("page-description").innerText = sectionContent[currentSection].description;
  document.getElementById("section-title").innerText = sectionContent[currentSection].title;
  document.getElementById("section-description").innerText = sectionContent[currentSection].description;
  document.title = sectionContent[currentSection].title + " | Adistec Brasil";
}

// ============================
// LOAD JSON
// ============================

fetch("assets/JSON/vendors.json")
  .then(res => res.json())
  .then(data => {
    if (!data[currentSection]) return;
    allItems = data[currentSection];
    renderTags(allItems);
    renderGrid(allItems);
  })
  .catch(err => console.error("Erro JSON:", err));

// ============================
// TAG SEARCH
// ============================

function handleTagSearch(value) {
  // atualiza o estado global da busca de tags
  tagSearchTerm = (value || "").toLowerCase().trim();

  // Se a busca estiver vazia, resetamos o estado visual
  if (tagSearchTerm === "") {
    tagsExpanded = false;
    renderTags(allItems);
    return;
  }

  // Quando o usuário busca, expandimos para mostrar resultados relevantes
  tagsExpanded = true;

  // Renderiza usando todos os itens — renderTags vai filtrar as tags pelo tagSearchTerm
  renderTags(allItems);
}

// ============================
// RENDER TAGS
// ============================

function renderTags(items) {

  const tagContainer = document.getElementById("tag-filters");
  const tagsSet = new Set();

  items.forEach(item => {
    if (item.tags) item.tags.forEach(tag => tagsSet.add(tag));
  });

  allTags = Array.from(tagsSet).sort();

  let filteredTags = allTags.filter(tag =>
    tag.toLowerCase().includes(tagSearchTerm)
  );

  const visibleTags = tagsExpanded
    ? filteredTags
    : filteredTags.slice(0, MAX_VISIBLE_TAGS);

  let html = `
    <button
      id="btn-all"
      class="btn btn-outline-primary me-2 mb-2 ${activeTags.size === 0 ? "active" : ""}"
      onclick="clearAllTags()">
      Todos
    </button>
  `;

  visibleTags.forEach(tag => {
    html += `
      <button
        class="btn btn-outline-primary me-2 mb-2 ${activeTags.has(tag) ? "active" : ""}"
        onclick="toggleTag('${tag}')">
        ${tag}
      </button>
    `;
  });

  if (filteredTags.length > MAX_VISIBLE_TAGS && tagSearchTerm === "") {
    html += `
      <button
        class="tag-toggle-btn ms-2"
        onclick="toggleTagsView()">
        ${tagsExpanded ? "▲ Ver menos tags" : "▼ Ver mais tags"}
      </button>
    `;
  }

  tagContainer.innerHTML = html;
}

// ============================
// TAG CONTROLS
// ============================

function toggleTagsView() {
  tagsExpanded = !tagsExpanded;
  renderTags(allItems);
}

function toggleTag(tag) {

  if (activeTags.has(tag)) {
    activeTags.delete(tag);
  } else {
    activeTags.add(tag);
  }

  if (activeTags.size === 0) {
    clearAllTags();
    return;
  }

  applyFilters();
  renderTags(allItems);
}

function clearAllTags() {
  activeTags.clear();
  tagSearchTerm = "";
  tagsExpanded = false;
  document.getElementById("tag-search").value = "";
  renderGrid(allItems);
  renderTags(allItems);
}

// ============================
// FILTER LOGIC
// ============================

function applyFilters() {

  const filtered = allItems.filter(item =>
    item.tags &&
    item.tags.some(tag => activeTags.has(tag))
  );

  renderGrid(filtered);
}

// ============================
// RENDER GRID
// ============================

function renderGrid(items) {

  const grid = document.getElementById("security-grid");
  grid.innerHTML = "";

  items.forEach(item => {

    const tagsHTML = item.tags
      ? item.tags.map(tag =>
          `<span class="badge bg-secondary me-1">${tag}</span>`
        ).join("")
      : "";

    grid.innerHTML += `
      <div class="col-xl-3 col-lg-4 col-md-6">
        <a href="${item.link}" class="text-decoration-none text-dark">
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <img src="${item.logo}" class="img-fluid mb-3" style="max-height:60px">
              <div class="mb-2">${tagsHTML}</div>
              <h5 class="fw-bold">${item.name}</h5>
              <p class="small text-muted">${item.description}</p>
            </div>
          </div>
        </a>
      </div>
    `;
  });
}
