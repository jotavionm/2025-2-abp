#!/usr/bin/env node
// Inicializa um usuário (admin) via linha de comando
// Uso: npm run init -- <email> <senha>

const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const pool = require("../controllers/db");

dotenv.config();

async function main() {
  try {
    const [mail, senha] = process.argv.slice(2);
    if (!mail || !senha) {
      console.error("Uso: npm run init -- <email> <senha>");
      process.exit(1);
    }

    const email = String(mail).trim();
    if (!email) {
      console.error("E-mail inválido");
      process.exit(1);
    }

    if (String(senha).length < 6) {
      console.error("A senha deve ter pelo menos 6 caracteres");
      process.exit(1);
    }

    const exists = await pool.query(
      "SELECT 1 FROM usuarios WHERE mail = $1 LIMIT 1",
      [email],
    );
    if (exists.rowCount > 0) {
      console.error("E-mail já cadastrado");
      process.exit(2);
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(String(senha), saltRounds);
    const result = await pool.query(
      "INSERT INTO usuarios (mail, senha) VALUES ($1, $2) RETURNING idusuario, mail",
      [email, hash],
    );

    const user = result.rows[0];
    console.log("Usuário criado com sucesso:", user);
    process.exit(0);
  } catch (err) {
    console.error("Erro ao criar usuário:", err?.message || err);
    process.exit(1);
  } finally {
    try {
      await pool.end();
    } catch {}
  }
}

main();
