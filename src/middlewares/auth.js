const jwt = require("jsonwebtoken");

function getSecret() {
  return process.env.JWT_SECRET || "dev-secret-change-me";
}

function readTokenFromCookie(req) {
  const raw = req.headers?.cookie;
  if (!raw) return null;
  const parts = raw.split(";");
  for (const p of parts) {
    const [k, v] = p.split("=");
    if (k && k.trim() === "token") return decodeURIComponent(v || "").trim();
  }
  return null;
}

module.exports = function auth(req, res, next) {
  try {
    let token = null;
    const header = req.headers?.authorization || req.headers?.Authorization;
    if (header && typeof header === "string") {
      const parts = header.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }
    if (!token) {
      token = readTokenFromCookie(req);
    }
    if (!token) {
      return res.status(401).json({ error: "Token ausente" });
    }
    const payload = jwt.verify(token, getSecret());

    req.user = {
      idusuario: payload.sub,
      mail: payload.mail,
      iat: payload.iat,
      exp: payload.exp,
      token,
    };

    return next();
  } catch (_err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
