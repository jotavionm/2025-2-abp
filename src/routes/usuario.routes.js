const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
const auth = require("../middlewares/auth");

// Atualiza e-mail e/ou senha do usuário autenticado
// Requer que um middleware de autenticação defina req.user (opcional)
router.put("/me", auth, usuarioController.updateMe);

// Alternativa para desenvolvimento: atualizar informando o id na rota
router.put("/:id", usuarioController.updateMe);

module.exports = router;
