// Importa o framework Express para criar e gerenciar o servidor web
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
// Carrega as variáveis de ambiente o mais cedo possível
dotenv.config();
const rotas = require("./routes");

// Cria uma instância do aplicativo Express
const app = express();

// Middleware para permitir o envio de dados em formato JSON no corpo das requisições
app.use(express.json());

// Lê a variável PORT definida no arquivo .env
const port = process.env.PORT;

// Inicia o servidor na porta definida e exibe uma mensagem no console
app.listen(port, function () {
  console.log(`Servidor rodando na porta ${port}`);
});

// Servir imagens estáticas da pasta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rota protegida para página de cadastro de notícias
const auth = require("./middlewares/auth");
app.get("/admin/noticias/nova", auth, function (_req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "noticias-create.html"));
});
app.get("/admin/noticias", auth, function (_req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "noticias-list.html"));
});
app.get("/admin/noticias/editar", auth, function (_req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "noticias-edit.html"));
});
// Páginas de gestão de publicações (protegidas)
app.get("/admin/publicacoes", auth, function (_req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "publicacoes-list.html"));
});
app.get("/admin/publicacoes/nova", auth, function (_req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "publicacoes-create.html"));
});
app.get("/admin/publicacoes/editar", auth, function (_req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "publicacoes-edit.html"));
});
// Páginas de gestão de oportunidades (protegidas)
app.get("/admin/oportunidades", auth, function (_req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "oportunidades-list.html"));
});
app.get("/admin/oportunidades/nova", auth, function (_req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "oportunidades-create.html"));
});
app.get("/admin/oportunidades/editar", auth, function (_req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "oportunidades-edit.html"));
});
// Servir arquivos estáticos (HTML/CSS/JS) da pasta public (um nível acima de src)
app.use(express.static(path.join(__dirname, "..", "public")));

// Usando as rotas
app.use("/api", rotas);

// Middleware para rotas não encontradas
app.use(function (_req, res) {
  res.status(404).json({ error: "Rota não encontrada" });
});
