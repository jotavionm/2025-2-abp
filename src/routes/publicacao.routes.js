const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const publicacaoController = require("../controllers/publicacao.controller");

// Configuração do multer para salvar imagens em /uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Formato de imagem inválido. Use PNG ou JPEG."));
    }
    cb(null, true);
  },
});

// Rotas para o CRUD de publicações
router.post(
  "/",
  upload.single("imagem"),
  publicacaoController.createPublicacao,
);
router.get("/", publicacaoController.getAllPublicacoes);
router.put(
  "/:id",
  upload.single("imagem"),
  publicacaoController.updatePublicacao,
);
router.delete("/:id", publicacaoController.deletePublicacao);

module.exports = router;
