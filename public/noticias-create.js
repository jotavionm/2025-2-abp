function setMsg(text, type = "") {
  const el = document.getElementById("msg");
  el.className = type;
  el.textContent = text || "";
}

function getToken() {
  // Primeiro tenta localStorage, depois cookie
  const t = localStorage.getItem("token");
  if (t) return t;
  const raw = document.cookie || "";
  const parts = raw.split(";");
  for (const p of parts) {
    const [k, v] = p.split("=");
    if (k && k.trim() === "token") return decodeURIComponent(v || "").trim();
  }
  return null;
}

document
  .getElementById("form-noticia")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("");
    const token = getToken();
    if (!token) {
      setMsg("Sessão expirada. Faça login novamente.", "error");
      setTimeout(() => (window.location.href = "/login.html"), 800);
      return;
    }

    const fd = new FormData();
    fd.append("titulo", document.getElementById("titulo").value.trim());
    fd.append("link", document.getElementById("link").value.trim());
    fd.append("postagem", document.getElementById("postagem").value);
    fd.append(
      "exibir",
      document.getElementById("exibir").checked ? "true" : "false",
    );
    const img = document.getElementById("imagem").files[0];
    if (img) fd.append("imagem", img);

    try {
      const res = await fetch("/api/noticias", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Falha ao salvar (HTTP ${res.status})`);
      }
      setMsg("Notícia criada com sucesso!", "success");
      setTimeout(() => (window.location.href = "/"), 800);
    } catch (err) {
      setMsg(err.message || "Erro ao salvar", "error");
    }
  });
