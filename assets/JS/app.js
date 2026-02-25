fetch("./assets/JSON/vendors.json")
  .then(response => response.json())
  .then(data => {

    renderCategory(
      data.security,
      "security-grid",
      "section.html?type=security",
      "./assets/IMG/icons/sec1.png"
    );

    renderCategory(
      data.alliances,
      "alliances-grid",
      "section.html?type=alliances",
      "./assets/IMG/icons/alliances1.png"
    );

    renderCategory(
      data.datacenter,
      "datacenter-grid",
      "section.html?type=datacenter",
      "./assets/IMG/icons/datacenter.png"
    );

  })
  .catch(err => console.error("Erro JSON:", err));


function renderCategory(items, containerId, ctaLink, ctaIcon) {

  const container = document.getElementById(containerId);

  if (!container) {
    console.error("Container não encontrado:", containerId);
    return;
  }

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center text-muted py-4">
        Nenhum item disponível.
      </div>
    `;
    return;
  }

  container.innerHTML = "";

  items.slice(0, 3).forEach(item => {

    const tagsHTML = item.tags
      ? item.tags.map(tag =>
          `<span class="badge bg-secondary me-1">${tag}</span>`
        ).join("")
      : "";

    container.innerHTML += `
      <div class="col-xl-3 col-lg-4 col-md-6">

        <a href="${item.link || "#"}" class="text-decoration-none text-dark">

          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">

              <img src="${item.logo}" class="img-fluid mb-3" style="max-height:60px">

              <div class="mb-2">
                ${tagsHTML}
              </div>

              <h5 class="fw-bold">${item.name}</h5>

              <p class="small text-muted">
                ${item.description}
              </p>

            </div>
          </div>

        </a>

      </div>
    `;
  });

  if (items.length > 3) {
    renderCTA(container, ctaLink, ctaIcon);
  }
}

function renderCTA(container, link, icon) {

  container.innerHTML += `
    <div class="col-xl-3 col-lg-4 col-md-6">

      <a href="${link}" class="text-decoration-none">

        <div class="card h-100 border-primary text-center">
          <div class="card-body d-flex flex-column justify-content-center">

            ${icon ? `<img src="${icon}" height="60" class="mb-3">` : ""}

            <h5 class="fw-bold text-primary">Ver mais</h5>
            <p class="small text-muted">Conheça toda a unidade</p>

          </div>
        </div>

      </a>

    </div>
  `;
}
