function setMessage(text, type = "") {
  const el = document.getElementById("msg");
  el.className = type;
  el.textContent = text || "";
}

async function doLogin(mail, senha) {
  const bodyData = { mail, senha };
  console.log("FRONTEND: Enviando para /api/auth/login:", JSON.stringify(bodyData));

  console.log("Enviando para o servidor:", { mail, senha });

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({bodyData}),
  });
  const data = await res.json().catch(() => ({}));
  
  console.log("FRONTEND: Resposta do servidor:", { status: res.status, data });

  // console.log(data);
  if (!res.ok) {
    const msg = data?.error || `Falha no login (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return data;
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  setMessage("", "");
  const mail = document.getElementById("mail").value.trim();
  const senha = document.getElementById("senha").value.trim();
  if (!mail || !senha) {
    setMessage("Informe e-mail e senha", "error");
    return;
  }
  try {
    const { token, usuario } = await doLogin(mail, senha);
    console.log("testt");
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    // Também grava um cookie simples (não-HttpOnly) para permitir proteção server-side de páginas estáticas
    document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=7200`;
    setMessage("Login realizado com sucesso. Redirecionando...", "success");
    setTimeout(() => {
      window.location.href = "/";
    }, 600);
  } catch (err) {
    console.error("Erro no login:", err);
  }
});
