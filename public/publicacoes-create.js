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

document.getElementById('form-publicacao').addEventListener('submit', async (e) => {
  e.preventDefault();
  setMsg('');
  const token = getToken();
  if (!token) {
    setMsg('Sessão expirada. Faça login novamente.', 'error');
    setTimeout(() => (window.location.href = '/login.html'), 700);
    return;
  }

  const fd = new FormData();
  fd.append('texto', document.getElementById('texto').value.trim());
  fd.append('ano', document.getElementById('ano').value);
  fd.append('link', document.getElementById('link').value.trim());
  fd.append('doi', document.getElementById('doi').value.trim());
  const img = document.getElementById('imagem').files[0];
  if (img) fd.append('imagem', img);

  try {
    const res = await fetch('/api/publicacoes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || `Falha ao salvar (HTTP ${res.status})`);
    setMsg('Publicação criada com sucesso!', 'success');
    setTimeout(() => (window.location.href = '/admin/publicacoes'), 800);
  } catch (err) {
    setMsg(err.message || 'Erro ao salvar', 'error');
  }
});

