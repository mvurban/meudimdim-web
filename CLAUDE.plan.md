# MeuDimDim — Roadmap de Implementação

---

## Fase 1 — Web (front-end com dados mockados)

### 1.0 ✅ Concluído
**Container básico**
- Docker + docker-compose + devcontainer

---

### 1.1 ✅ Concluído
**Fundação**
- Layout base, tema dark/light, providers
- `types/index.ts` — todos os tipos do sistema
- `lib/mock-data.ts` — dados mockados realistas
- `lib/utils.ts` — formatação BRL/USD, datas, cores
- `lib/theme-context.tsx` — ThemeProvider com localStorage
- `styles/globals.css` — design tokens CSS (dark/light)
- `tailwind.config.ts` — fontes Syne + DM Sans
- `components/layout/` — Sidebar, Topbar, AppShell, ThemeToggle
- Stubs de todas as páginas (dashboard, produtos, ações, etc.)

---

### 1.2 ✅ Concluído
**Área Administrativa**
- Categorias (CRUD com mock)
- Classes de Ativo (CRUD com mock, vinculada à categoria)
- Instituições (CRUD com mock)
- Sidebar: rotas corrigidas, submenu Configurações expansível, footer com sessão real
- Middleware: proteção de todas as rotas

---

### 1.3 🔜 Próximo
**Cotações de Câmbio**
- Tabela mês a mês por moeda (USD, EUR, etc.)
- CRUD com mock

---

### 1.4 ⬜ Pendente
**Módulo Produtos**
- Listagem com filtros (categoria, classe, instituição, região)
- Cadastro e edição de produto
- Lançamentos mensais (snapshot)
- Dividendos (sub-área do produto)

---

### 1.5 ⬜ Pendente
**Módulo Ações**
- Listagem de tickers por corretora
- Cotações mockadas (estrutura para Yahoo Finance)
- Fechamento mensal — confirmação de valor por corretora
- Dividendos de ações

---

### 1.6 ⬜ Pendente
**Visão por Instituição**
- Evolução mensal (aportes, retiradas, rendimento, valor total)
- Rentabilidade acumulada
- Filtro por ano

---

### 1.7 ⬜ Pendente
**Dashboard / Consolidado**
- Patrimônio total do mês selecionado
- Variação do mês (aporte, retirada, rendimento)
- Gráficos Recharts — alocação por categoria, instituição, região
- Evolução mensal mês a mês
- Filtro por mês/ano

---

## Fase 2 — API (back-end)

| # | Tópico |
|---|--------|
| 2.1 | Prisma schema completo + PostgreSQL + seed |
| 2.2 | Autenticação — Google OAuth + registro automático |
| 2.3 | CRUD tabelas de referência (categorias, classes, instituições) |
| 2.4 | Módulo Produtos — cadastro + lançamentos + cálculos automáticos |
| 2.5 | Cotações de câmbio |
| 2.6 | Módulo Ações — tickers + Yahoo Finance + fechamento mensal |
| 2.7 | Endpoints de consolidação e dashboard |

---

## Fase 3 — Integração Web + API

| # | Tópico |
|---|--------|
| 3.1 | NextAuth v5 + cliente HTTP + substituir mocks pela API real |
| 3.2 | Testes end-to-end + ajustes finais |
| 3.3 | Script de importação CSV/XLSX para dados históricos |