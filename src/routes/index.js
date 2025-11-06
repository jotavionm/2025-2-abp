const express = require("express");
const router = express.Router();

const publicacao = require("./publicacao.routes");
const noticia = require("./noticia.routes");
const oportunidade = require("./oportunidade.routes");
const auth = require("./auth.routes");
const usuario = require("./usuario.routes");

router.use("/publicacoes", publicacao);
router.use("/noticias", noticia);
router.use("/oportunidades", oportunidade);
router.use("/auth", auth);
router.use("/usuarios", usuario);

module.exports = router;
