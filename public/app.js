async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function renderList(title, items, renderItem) {
  const section = document.getElementById("conteudo");
  section.innerHTML = `<h2>${title}</h2>`;
  if (!items || items.length === 0) {
    section.innerHTML += "<p>Nenhum item encontrado.</p>";
    return;
  }
  const ul = document.createElement("ul");
  items.forEach((it) => {
    const li = document.createElement("li");
    li.innerHTML = renderItem(it);
    ul.appendChild(li);
  });
  section.appendChild(ul);
}

document.getElementById("btn-noticias").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const data = await fetchJSON("/api/noticias");
    renderList("Notícias", data, (n) => {
      const img = n.filepath
        ? `<br/><img src="${n.filepath}" alt="imagem" style="max-height:90px"/>`
        : "";
      return `<strong>${n.titulo ?? ""}</strong> — <a href="${n.link ?? "#"}" target="_blank">link</a> ${img}`;
    });
  } catch (err) {
    alert("Erro ao carregar notícias: " + err.message);
  }
});

document
  .getElementById("btn-publicacoes")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const data = await fetchJSON("/api/publicacoes");
      renderList("Publicações", data, (p) => {
        const img = p.filepath
          ? `<br/><img src="${p.filepath}" alt="imagem" style="max-height:90px"/>`
          : "";
        return `<strong>${p.ano ?? ""}</strong> — ${p.texto ?? ""} ${img}`;
      });
    } catch (err) {
      alert("Erro ao carregar publicações: " + err.message);
    }
  });

document
  .getElementById("btn-oportunidades")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const data = await fetchJSON("/api/oportunidades");
      renderList("Oportunidades", data, (o) => {
        return `<strong>${o.titulo ?? ""}</strong> — validade: ${o.validade ?? ""}`;
      });
    } catch (err) {
      alert("Erro ao carregar oportunidades: " + err.message);
    }
  });
