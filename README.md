# MeuDimDim — Instruções do Projeto

## Objetivo

O MeuDimDim é um sistema web de controle financeiro pessoal. Seu propósito é permitir que o usuário registre e acompanhe a evolução do seu patrimônio ao longo do tempo, produto a produto, mês a mês.

O sistema é baseado no conceito de **snapshots mensais**: o usuário registra manualmente o estado de cada produto ao final de cada mês (aporte, retirada, rentabilidade e valor final). Todo o restante — consolidados, gráficos, visões por instituição, por categoria, por região — é derivado desses lançamentos. Não há integração automática com bancos ou corretoras, exceto na área de Ações, que busca cotações via Yahoo Finance.

O sistema suporta múltiplos usuários. Cada usuário gerencia exclusivamente seus próprios dados. O login é feito via Google OAuth, e o cadastro do usuário ocorre automaticamente na primeira autenticação.

---

## Conceitos Fundamentais

### Snapshot mensal
Cada lançamento de produto representa o retrato daquele produto em um determinado mês. Uma vez registrado, o valor não muda automaticamente — ele reflete o que o usuário informou naquele fechamento. Isso vale para todos os produtos, incluindo ações: o valor consolidado de ações por corretora é confirmado pelo usuário ao fechar o mês.

### Produto
É a entidade central do sistema. Um produto representa qualquer aplicação financeira do usuário: um CDB, um fundo, um ETF, um FII, uma conta remunerada, etc. Cada produto possui dados cadastrais fixos e uma série de lançamentos mensais.

### Lançamento mensal de produto
É o registro do estado de um produto em um determinado mês/ano. Contém os valores de aporte, retirada, rentabilidade percentual, renda gerada e valor final. Os campos calculados (renda, valor final, valor em BRL, valor em USD) são computados pelo backend no momento do salvamento.

### Ações como produto consolidado
Ações são gerenciadas em uma área dedicada (por ticker, por corretora). Porém, ao fechar o mês, o sistema gera automaticamente um lançamento no módulo de Produtos com o valor total consolidado por corretora (ex: "Ações Clear"). Esse lançamento segue o mesmo modelo dos demais produtos.

### Liquidez
Atributo de cada produto que indica o tempo estimado para resgate. Expresso em dias (se menor que 1 mês), em meses (se menor que 1 ano) ou em anos.

### Cotação de câmbio
Cada usuário mantém sua própria tabela de cotações mês a mês. Essa cotação é usada para converter valores: produtos nacionais podem ser visualizados em USD; produtos internacionais (lançados em USD) são convertidos para BRL. A cotação é sempre informada pelo usuário no momento do lançamento.

### Região
Campo de cada produto que indica o país ou região onde o ativo está alocado. Tudo que não for Brasil é considerado Internacional para fins de consolidação.

### Dividendos
Sub-área dentro de cada produto (e dentro da área de Ações) onde o usuário registra recebimentos de dividendos, JCP ou outros proventos. Cada registro tem data, valor e tipo.

### Tabelas de referência
São listas administráveis por cada usuário para sua própria conta: Categorias, Classes de Ativo, Instituições. Não são globais do sistema.

---

## Arquitetura

O sistema é composto por duas aplicações distintas:

### API (Back-end)
Aplicação Node.js dedicada exclusivamente ao acesso a dados. Responsável por:
- Toda a lógica de negócio e cálculos financeiros
- Acesso ao banco de dados via Prisma
- Autenticação e autorização (validação de sessão/token)
- Endpoints REST consumidos pelo front-end
- Busca de cotações de ações via Yahoo Finance
- Execução do script de importação de dados históricos

### Web (Front-end)
Aplicação Next.js (App Router) responsável pela interface do usuário. Consome exclusivamente a API. Não acessa o banco de dados diretamente.
- Autenticação via NextAuth v5 (Google OAuth)
- No primeiro login, o front-end chama a API para registrar o usuário automaticamente
- Toda navegação, formulários e visualizações são servidos pelo Next.js
- Gráficos e dashboards com Recharts

### Infraestrutura
- Docker com docker-compose para orquestrar os serviços (API, Web, PostgreSQL)
- `.devcontainer` configurado para VSCode com Ubuntu estável
- Versões estáveis mais recentes de todos os serviços

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Front-end | Next.js (App Router) |
| Autenticação | NextAuth v5 — Google OAuth |
| Back-end / API | Node.js (Express ou Fastify) |
| ORM | Prisma |
| Banco de dados | PostgreSQL |
| Infra | Docker + docker-compose + .devcontainer |
| IDE | VSCode |
| UI | Tailwind CSS + Radix UI + shadcn/ui |
| Gráficos | Recharts |
| Cotações de ações | yahoo-finance2 (npm, gratuito, sem chave de API) |
| Importação histórica | Script Node.js standalone — lê CSV/XLSX |

---

## Módulos do Sistema

### 1. Dashboard / Consolidado
Visão geral do patrimônio. Sem inputs — tudo derivado dos lançamentos de produtos.

- Patrimônio total no mês selecionado
- Variação do mês: aporte, retirada, rendimento, valor final
- Distribuição por categoria
- Distribuição por classe de ativo
- Distribuição por região (Brasil vs Internacional)
- Distribuição por instituição
- Filtro por mês/ano para visualizar o retrato de qualquer período
- Visão anual: mês a mês sem filtro de corretora

### 2. Produtos
Núcleo do sistema. Listagem de produtos ativos do usuário com acesso aos lançamentos mensais e dividendos.

**Listagem:**
- Exibe apenas produtos com status ativo
- Produtos encerrados somem da listagem mas o histórico é preservado
- Filtros por categoria, classe, instituição, região

**Cadastro de produto (dados fixos):**
- Nome
- CNPJ (opcional)
- Categoria (Renda Fixa / Multimercado / Renda Variável / Internacional / Commodities)
- Classe (administrável: Inflação, Pós-fixado, FII, etc.)
- Instituição (administrável)
- Região / País
- Liquidez (tempo para resgate)
- Status: ativo / encerrado

**Lançamento mensal (por produto, mês a mês):**
- Mês / Ano
- Aporte
- Retirada
- Rentabilidade (%)
- Renda — **calculado**: `valor_final_mês_anterior × rentabilidade%`
- Valor original (na moeda do produto)
- Valor em BRL — **calculado** com base na cotação do mês
- Valor em USD — **calculado** com base na cotação do mês
- Valor Final — **calculado**: `valor_anterior + aporte − retirada + renda`

**Dividendos (sub-área do produto):**
- Data
- Valor
- Tipo: Dividendo / JCP / Outros

### 3. Ações
Área dedicada para renda variável. Gerenciamento por ticker e por corretora.

- Cadastro de tickers: corretora, quantidade, preço médio de compra
- Cotação atual via Yahoo Finance (tempo real com delay aceitável)
- Calculado automaticamente: valor atual, variação do dia, rentabilidade desde compra
- Fechamento mensal: usuário confirma o valor total por corretora → sistema gera automaticamente o lançamento mensal no produto correspondente em Produtos
- Dividendos de ações (sub-área): data, ticker, valor, tipo

### 4. Visão por Instituição
Dashboard derivado dos lançamentos de produtos, filtrado por instituição.

- Evolução mês a mês: aportes, retiradas, rendimento, valor total
- Rentabilidade acumulada
- Filtro por ano
- Sem inputs diretos

### 5. Cotações (Câmbio)
Tabela de câmbio por usuário, mês a mês. Usada nos cálculos de conversão BRL ↔ USD.

- Mês / Ano
- Moeda (USD, EUR, etc.)
- Cotação (valor em BRL)

### 6. Área Administrativa
Gerenciamento das tabelas de referência do usuário.

- **Categorias**: Renda Fixa, Multimercado, Renda Variável, Internacional, Commodities
- **Classes de ativo**: Inflação, Pós-fixado, FII, Ações, etc. — vinculada à categoria
- **Instituições**: Itaú, XP, Clear, Avenue, Rico, etc.

---

## Ordem de Implementação

| Fase | Conteúdo |
|---|---|
| 1 | Docker + docker-compose + .devcontainer + dois repositórios (api/ e web/) |
| 2 | API: Prisma schema completo + conexão PostgreSQL + seed de dados de exemplo |
| 3 | API: Autenticação — validação de token Google + registro automático de usuário |
| 4 | API: CRUD de tabelas de referência (categorias, classes, instituições) |
| 5 | API: Módulo Produtos — cadastro + lançamentos mensais + cálculos automáticos |
| 6 | API: Cotações de câmbio |
| 7 | API: Módulo Ações — tickers + Yahoo Finance + fechamento mensal |
| 8 | API: Endpoints de consolidação e dashboard |
| 9 | Web: Next.js + NextAuth + cliente HTTP para API |
| 10 | Web: Área administrativa (tabelas de referência) |
| 11 | Web: Módulo Produtos — listagem + cadastro + lançamentos + dividendos |
| 12 | Web: Módulo Ações |
| 13 | Web: Cotações de câmbio |
| 14 | Web: Visão por Instituição |
| 15 | Web: Dashboard / Consolidado com gráficos |
| 16 | Script de importação CSV/XLSX para dados históricos |