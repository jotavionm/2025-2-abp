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

async function loadPublicacao(id) {
  const token = getToken();
  if (!token) {
    setMsg('Sessão expirada. Faça login novamente.', 'error');
    setTimeout(() => (window.location.href = '/login.html'), 700);
    return;
  }
  const res = await fetch(`/api/publicacoes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `Falha ao buscar publicação (HTTP ${res.status})`);
  }
  const p = await res.json();
  document.getElementById('texto').value = p.texto || '';
  document.getElementById('ano').value = p.ano || '';
  document.getElementById('link').value = p.link || '';
  document.getElementById('doi').value = p.doi || '';
  const prev = document.getElementById('preview');
  if (p.filepath) { prev.src = p.filepath; } else { prev.style.display = 'none'; }
}

document.getElementById('form-publicacao').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = getToken();
  if (!token) {
    setMsg('Sessão expirada. Faça login novamente.', 'error');
    setTimeout(() => (window.location.href = '/login.html'), 700);
    return;
  }
  const id = getIdFromQuery();
  const fd = new FormData();
  fd.append('texto', document.getElementById('texto').value.trim());
  fd.append('ano', document.getElementById('ano').value);
  fd.append('link', document.getElementById('link').value.trim());
  fd.append('doi', document.getElementById('doi').value.trim());
  const img = document.getElementById('imagem').files[0];
  if (img) fd.append('imagem', img);

  try {
    const res = await fetch(`/api/publicacoes/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || `Falha ao salvar (HTTP ${res.status})`);
    }
    setMsg('Publicação atualizada com sucesso!', 'success');
    setTimeout(() => (window.location.href = '/admin/publicacoes'), 800);
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
  try { await loadPublicacao(id); } catch (err) { setMsg(err.message, 'error'); }
})();

