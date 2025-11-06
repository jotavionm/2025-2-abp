function setMsg(text, type = "") {
  const el = document.getElementById("msg");
  el.className = type;
  el.textContent = text || "";
}

function getToken() {
  const t = localStorage.getItem("token");
  if (t) return t;
  const raw = document.cookie || "";
  const parts = raw.split(';');
  for (const p of parts) {
    const [k, v] = p.split('=');
    if (k && k.trim() === 'token') return decodeURIComponent(v || '').trim();
  }
  return null;
}

function getIdFromQuery() {
  const u = new URL(window.location.href);
  return u.searchParams.get('id');
}

async function loadNoticia(id) {
  const token = getToken();
  if (!token) {
    setMsg('Sessão expirada. Faça login novamente.', 'error');
    setTimeout(() => (window.location.href = '/login.html'), 700);
    return;
  }
  const res = await fetch(`/api/noticias/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `Falha ao buscar notícia (HTTP ${res.status})`);
  }
  const n = await res.json();
  document.getElementById('titulo').value = n.titulo || '';
  document.getElementById('link').value = n.link || '';
  if (n.postagem) document.getElementById('postagem').value = n.postagem.substring(0,10);
  document.getElementById('exibir').checked = !!n.exibir;
  const prev = document.getElementById('preview');
  if (n.filepath) { prev.src = n.filepath; } else { prev.style.display = 'none'; }
}

document.getElementById('form-noticia').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = getToken();
  if (!token) {
    setMsg('Sessão expirada. Faça login novamente.', 'error');
    setTimeout(() => (window.location.href = '/login.html'), 700);
    return;
  }
  const id = getIdFromQuery();
  const fd = new FormData();
  fd.append('titulo', document.getElementById('titulo').value.trim());
  fd.append('link', document.getElementById('link').value.trim());
  fd.append('postagem', document.getElementById('postagem').value);
  fd.append('exibir', document.getElementById('exibir').checked ? 'true' : 'false');
  const img = document.getElementById('imagem').files[0];
  if (img) fd.append('imagem', img);

  try {
    const res = await fetch(`/api/noticias/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || `Falha ao salvar (HTTP ${res.status})`);
    }
    setMsg('Notícia atualizada com sucesso!', 'success');
    setTimeout(() => (window.location.href = '/admin/noticias'), 800);
  } catch (err) {
    setMsg(err.message || 'Erro ao salvar', 'error');
  }
});

(async function init(){
  const id = getIdFromQuery();
  if (!id) {
    setMsg('ID não informado', 'error');
    return;
  }
  try { await loadNoticia(id); } catch (err) { setMsg(err.message, 'error'); }
})();

