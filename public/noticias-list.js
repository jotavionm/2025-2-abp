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

async function loadNoticias() {
  try {
    const res = await fetch('/api/noticias');
    const data = await res.json();
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    data.forEach(n => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${n.titulo ?? ''}</td>
        <td>${n.idnoticia}</td>
        <td>
          <div class="actions">
            <button data-edit="${n.idnoticia}">Atualizar</button>
            <button data-del="${n.idnoticia}">Excluir</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.addEventListener('click', onActionClick);
  } catch (err) {
    setMsg('Falha ao carregar notícias: ' + (err.message || err), 'error');
  }
}

function onActionClick(e) {
  const editId = e.target.getAttribute('data-edit');
  const delId = e.target.getAttribute('data-del');
  if (editId) {
    window.location.href = `/admin/noticias/editar?id=${encodeURIComponent(editId)}`;
    return;
  }
  if (delId) {
    doDelete(delId);
  }
}

async function doDelete(id) {
  const token = getToken();
  if (!token) {
    setMsg('Sessão expirada. Faça login novamente.', 'error');
    setTimeout(() => (window.location.href = '/login.html'), 700);
    return;
  }
  if (!confirm('Tem certeza que deseja excluir esta notícia?')) return;
  try {
    const res = await fetch(`/api/noticias/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || `Falha ao excluir (HTTP ${res.status})`);
    }
    setMsg('Notícia excluída com sucesso!', 'success');
    await loadNoticias();
  } catch (err) {
    setMsg(err.message || 'Erro ao excluir', 'error');
  }
}

loadNoticias();

