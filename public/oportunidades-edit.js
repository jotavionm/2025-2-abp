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

async function loadOportunidade(id) {
  const token = getToken();
  if (!token) {
    setMsg('Sessão expirada. Faça login novamente.', 'error');
    setTimeout(() => (window.location.href = '/login.html'), 700);
    return;
  }
  const res = await fetch(`/api/oportunidades/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `Falha ao buscar oportunidade (HTTP ${res.status})`);
  }
  const o = await res.json();
  document.getElementById('titulo').value = o.titulo || '';
  document.getElementById('descricao').value = o.descricao || '';
  if (o.validade) document.getElementById('validade').value = o.validade.substring(0,10);
  document.getElementById('exibir').checked = !!o.exibir;
}

document.getElementById('form-oportunidade').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = getToken();
  if (!token) {
    setMsg('Sessão expirada. Faça login novamente.', 'error');
    setTimeout(() => (window.location.href = '/login.html'), 700);
    return;
  }
  const id = getIdFromQuery();
  const payload = {
    titulo: document.getElementById('titulo').value.trim(),
    descricao: document.getElementById('descricao').value.trim(),
    validade: document.getElementById('validade').value,
    exibir: document.getElementById('exibir').checked,
  };

  try {
    const res = await fetch(`/api/oportunidades/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.error || `Falha ao salvar (HTTP ${res.status})`);
    }
    setMsg('Oportunidade atualizada com sucesso!', 'success');
    setTimeout(() => (window.location.href = '/admin/oportunidades'), 800);
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
  try { await loadOportunidade(id); } catch (err) { setMsg(err.message, 'error'); }
})();

