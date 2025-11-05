## Visão Geral

API Node.js (Express + PostgreSQL) para gerenciamento de notícias, publicações e oportunidades. Suporta upload de imagens (PNG/JPEG) para `/uploads` e salva o caminho em `filepath`.

## Requisitos
- Node.js 18+ e npm
- PostgreSQL 13+

## Clonar e Instalar
```
git clone https://github.com/arleysouza/2025-2-abp
cd server
npm install
```

## Configurar Ambiente
- Ajuste `server/.env` conforme seu ambiente:
  - `PORT=3000`
  - `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`

## Criar Banco e Tabelas
- Crie o banco (ex.: `abp`) no PostgreSQL
- Rode o script SQL para criar as tabelas:
  - psql: `psql -h <host> -U <usuario> -d <db> -f src/controllers/db.sql`
  - ou cole o conteúdo de `src/controllers/db.sql` no pgAdmin e execute

## Executar
- Desenvolvimento: `npm run dev`
- Produção/local: `npm start`

O servidor sobe em `http://localhost:3000` e expõe:
- API: `http://localhost:3000/api`
- Arquivos enviados: `http://localhost:3000/uploads/<arquivo>`

## Testes de Rotas
### Com REST Client (VS Code)
- Abra `server/http/*.http` e clique em `Send Request` (recomendado instalar a extensão REST Client)

### Com curl (exemplos)
- Criar notícia com imagem:
  - `curl -X POST http://localhost:3000/api/noticias -F "titulo=Exemplo" -F "link=https://exemplo.com" -F "postagem=2025-10-01" -F "exibir=true" -F "imagem=@../sample-data/um.png;type=image/png"`
- Criar publicação com imagem:
  - `curl -X POST http://localhost:3000/api/publicacoes -F "texto=Publicação" -F "ano=2013" -F "link=https://exemplo.com" -F "doi=https://doi.org/10.0000/x" -F "imagem=@../sample-data/tres.png;type=image/png"`

Campo de arquivo esperado: `imagem` (PNG/JPEG). Arquivos são gravados em `server/src/uploads` e servidos via `/uploads`.

## Qualidade de Código
- Lint: `npm run lint`
- Lint (autocorreção): `npm run lint:fix`
