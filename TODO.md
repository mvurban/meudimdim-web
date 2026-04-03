# REGRAS - todo.md para uso da IA.

## Convenção de marcadores

- `- [ ]` = tarefa pendente a implementar
- `- [x]` = tarefa concluída → vai para `# CONCLUÍDOS - [x]`
- `- [+]` = proposta futura (pode ou não ser produzida) → vai para `# FUTURO? - [+]`
- `- [-]` = proposta cancelada / não implementada → vai para `# NÃO IMPLEMENTADOS - [-]`
- `- [?]` = item em dúvida / não fazer nada - ignorar

## Fluxo principal

1. Ler o todo.md completo
2. Identificar os itens do tópico "Em Andamento"
3. Executar item por item, um por vez
4. Ao final de cada item, perguntar se pode prosseguir para o próximo
5. À medida que conclui cada item, marcar com [x] no todo.md
6. Ao finalizar todos os itens, perguntar se o usuário quer mover os concluídos para "# CONCLUÍDOS - [x]"
7. Ao mover, replicar o texto exato precedido de data e hora e a área da tarefa: `- [x] 2026-03-22 14:30 — [Ações] - texto original da tarefa`
8. Sempre inserir os recém-concluídos no topo da seção, empurrando os mais antigos para baixo.

Regra especial — itens ponteiros:

Se um item em "Em Andamento" aponta para outro (ex: "faça o item dashboard", "faça o primeiro item de Produtos"):

- Executa o item apontado
- Move o item apontado para Concluídos (com data/hora + área + texto exato)
- Apaga o ponteiro do "Em Andamento" — ele não vai para Concluídos
- O ponteiro é descartável após cumprir sua função

---

## Em Andamento


---

## Geral

## Dashboard

## Produtos

- [ ] Quando removo todas as ações de um produto agregado, este produto deverá ser removido também.
- [?] Pensar em como ficarão os anos e meses ao iniciar o sistema ou quando fizer uma importação. Como fica se tiver coisas em 2002 e depois só em 2025? Se tiver coisa em 1980?
- [ ] Testar a importação de produtos.

---

## Copiar do mês anterior

---

## Classe de Ativos

---

## Ações

- [ ] Ao entrar no sistema e fazer login, quando aceesso ações, diz que a ultima atualização foi a um instante, porém a tela com a lista de ações não está atualizada com as cotações mais recentes.

---

## Dividendos

- [?] Testar a área de dividendos - de ações, de produtos, dividendos em produtos agregados?

## Liquidez

---

## Mock

---

## Benchmark

---

## Mock inicial - fase de teste

---

# Cache

# FASE 2

## Admin

---

# FASE BACKEND

## Seed do prisma - fase de produção

- Ao criar um novo usuário deve-se popular o mês corrente com 2 produtos de exemplo, deve popular as tabelas de categorias, classes de ativos, instituições, regiões, liquidez e cotação conforme regra de seed de primeiro cadastro

### Regra de seed de primeiro cadastro

---

# CONCLUÍDOS - [x]

- [x] 2026-03-31 10:30 — [Ações] - No filtro de instituições, mostrar apenas as instituições em que haja conteúdo pra mostrar.
- [x] 2026-03-31 10:30 — [Ações] - Se eu tento incluir uma ação com mesmo nome ele tenta gravar e dá erro oculto. Como deve funcionar: Se tentar cadastrar uma ação que já exista na mesma instituição, avisar que não é possível que é pra editar a quantidade de ações. Se for uma ação já existente mais em outra instituição que ainda não exista esta ação, aí sim permitir.
- [x] 2026-03-31 10:30 — [Ações] - Ao atualizar cotações, mude a barra de progresso pelo loading padrão usado na importação, mude a estratégia de fake e faça o loading enquanto durar o processo.
- [x] 2026-03-31 10:30 — [Ações] - O valor de fechamento no consolidado está com uma cor diferente dos demais, mude a cor para o padrão do restante dos demais itens do concolidado.
- [x] 2026-03-31 10:30 — [Ações] - Destacar as linhas de títulos da ação, tanto o cabeçalho, quanto o consolidado, melhore o contraste.
- [x] 2026-03-31 10:30 — [Ações] - A coluna Rend. dia, vai se chamar Rend. Hoje e terá o conteúdo atual seguido do valor correspondente. Ex.: seta 2.15% (R$ 1.250,00). No consolidado da coluna, faça a mesma coisa, inclua o valor somado.
- [x] 2026-03-31 10:30 — [Ações] - Valores de cabeçalho maiores que 10.000 representar por K, M, B (mil, milhão, Bilhão) Ex.: 10.345 ficaria como 10k, 9.000 ficaria como 9.000 mesmo.
- [x] 2026-03-31 10:30 — [Ações] - Abreviar o cabeçalho: Preço de compra vira Compra, preço atual, vira Atual, Valor Total vira Total
- [x] 2026-03-30 17:45 — Na importação de dividendos e ações, inserção em bulk (createMany) em vez de um por um. Endpoints POST /api/acoes/bulk e POST /api/stock-dividends/bulk criados. Modais trocados para spinner indeterminado já que é chamada única.
- [x] 2026-03-30 17:45 — Colocar o seletor de ano em ordem do mais recente pro mais antigo, mais recente primeiro.
- [x] 2026-03-30 17:45 — Descrição no popup tá assim: açãoões corrigir.
- [x] 2026-03-30 17:30 — Quando finalizar a importação de ações, em background atualizar as cotações das ações no yahoo finance.
- [x] 2026-03-30 17:30 — Ao finalizar a importação está caindo na tela de ações, mas só com 3 ou 4 ações, preciso dar um refresh pra que todas as ações sejam carregadas.
- [x] 2026-03-30 17:30 — Importação de ações está gerando mais de um registro dentro de produtos com o mesmo nome "Ações Clear".
- [x] 2026-03-30 17:30 — A importação de dividendos deve gerar vários registros por ticker se encontrar várias entradas.
- [x] 2026-03-30 17:30 — Nas importações, o que importa é a ordem vir correta, o cabeçalho pode ser ignorado. Hoje dá erro se o cabeçalho não corresponder ao esperado.
- [x] 2026-03-30 17:30 — Impedir Instituições de serem removidas se existir produtos associados. Mesma coisa pra todas as tabelas auxiliares. O comportamento é: clica no ícone apagar, pergunta se confirma, se confirmar verifique se tem produtos e/ou ações/fiis associados, se sim, mostra alerta danger informando que não é possível pois tem produtos/ações associados.
- [x] 2026-03-30 15:30 — Salvar cotações das ações no banco em lote: substituído N queries individuais por uma única query SQL com CASE WHEN, reduzindo o round-trip ao banco para 1 independente da quantidade de tickers.
- [x] 2026-03-30 15:30 — Ao abrir a lista de ações pela primeira vez, ordenar por rendimento do dia do maior para o menor (sort padrão).
- [x] 2026-03-30 — Retry de ticker com falha no sininho agora salva os preços no banco (PUT /api/acoes/refresh) e marca a notificação como resolvida (verde com ✓).
- [x] 2026-03-30 — Botão "Limpar tudo" no dropdown do sininho para apagar todas as notificações do usuário.
- [x] 2026-03-30 — Sininho com status colorido por severidade (vermelho/amarelo/verde/cinza), indicador visual na borda de cada notificação, botão de retry para tickers com falha e lista expandível quando há mais de 2 tickers.
- [x] 2026-03-30 — Fechamento da ação buscando valor errado do Yahoo Finance. Corrigido usando range=1d para que chartPreviousClose retorne o pregão anterior correto. Adicionado timeout de 5s por ticker para evitar travamento do lote.
- [x] 2026-03-30 — os dividendos de uma ação devem mudar o rend. total, mas não o valor total. Apenas coloca o dividendo como parte do rendimento da ação, apenas total, sem mexer no diário.
- [x] 2026-03-30 — vamos criar um sinal no cabeçalho com um i de informação ou algo do tipo pra quando o usuário ponterar o mouse, poder ver um tooltip com uma explicação. Isso vai ser padrão no sistema todo, o mesmo simbolo.
- [x] 2026-03-30 — a barra de progresso do refresh foi refeita para processar todos os tickers em lote único com barra fake animada (0→85% desacelerando, pula para 100% ao receber resposta).
- [x] 2026-03-30 — Ordenação da lista de ações em todos os campos (ticker, qtd, preço de compra, fechamento, preço atual, rend. dia, rend. total, valor total). Clique no header ordena asc/desc com indicador visual.
- [x] 2026-03-30 — Preço de fechamento das ações buscando incorretamente do Yahoo Finance (campo chartPreviousClose retornava 2 pregões atrás). Corrigido para usar regularMarketPreviousClose.
- [x] 2026-03-30 — O atualizar cotações não estava criando barra de progresso (fazia tudo de uma vez). Corrigido para processar um ticker por vez com barra de progresso incremental no RefreshModal.
- [x] 2026-03-30 — Linha de consolidado no final da tabela de ações com total de qtd, total investido, total do preço atual, rendimento do dia (vs fechamento anterior) e rendimento total, além do valor total.
- [x] 2026-03-30 — Trocar de lugar nas ações o Valor Atual pelo total investido, apenas na área em destaque acima da lista. Não precisa mudar nada de lugar na lista.
- [x] 2026-03-30 — Fazer um teste de carregamento com o mock totalmente zerado.
- [x] 2026-03-30 — Ao criar um novo usuário os mocks devem gerar informação de produtos de abril/2024 até o mês/ano atual. Cada mês, iniciando em abril/2024 deve ser a evolução do anterior, com mais produtos e valores mais altos, até um total no mês/ano atual de 1 milhão de reais e 25 produtos.
- [x] 2026-03-30 — O mock de categorias, instituições e classes de ativos e liquidez deve buscar as mais usadas no mercado financeiro.
- [x] 2026-03-26 — Criar busca por nome do produto, mesma linha dos filtros.
- [x] 2026-03-26 — Criar uma área para acompanhar dividendos, seja de ações, fundos ou fiis.
      Esta área vai mostrar o consolidado recebido de dividendos mês a mês, últimos 12 meses do ano selecionado. Se ano atual, mostra os últimos 12 meses; se ano antigo, mostra os 12 meses do ano. A tela segue o mesmo estilo da área consolidado mensal. Filtros somente de instituições, não tem categorias. Nas colunas vai ter o mês/ano, percentual de evolução comparado com o valor total do mês anterior (se não tiver nada no mês anterior, mostra um tracinho) e o valor total do dividendo. Ao clicar na linha (toda a linha é clicável) abre popup mostrando todos os produtos que geraram dividendos naquele mês, com ordem de maior dividendo pro menor, agrupado por instituição. Nessa listamostra a instituição, o ativo e o valor do dividendo (dividendo total = dividendo + jcp + outros). Tem um botão de fechar o popup ou ao clicar fora ele volta pra lista.
- [x] 2026-03-26 — Ao fazer o agregado de ações virar um produto o sistema deve contabilizar os dividendos do agregado e colocar no produto. Por exemplo se itub4 e petr4, que são ações da instituição Clear, receberem dividendos, quando o sistema atualizar os produtos agregados, o dividendos recebidos por essas ações, no mês em questão, serão somados ao produto agregado.
- [x] 2026-03-26 — Ver a área de dominio sessão dividendos para entender o seu funcionamento.
- [x] 2026-03-26 — Criar novo item de menu chamado dividendos.
- [x] 2026-03-26 — Estado inicial vazio: quando o usuário não tem nenhuma ação cadastrada, exibir mensagem orientando com botão "Adicionar primeira ação".
- [x] 2026-03-24 15:00 — O mecanismo de verificação que testa se o mês atual tem produtos permanece.
- [x] 2026-03-24 15:00 — Os campos aporte e retirada não são copiados para o mês seguinte — são eventos pontuais do mês.
- [x] 2026-03-24 15:00 — Ao copiar do mês anterior, o sistema tenta recuperar dados do Yahoo Finance para montar os agregados corretamente no mês atual.
- [x] 2026-03-24 15:00 — Qualquer alteração em meses anteriores ao mês corrente deve exibir popup danger zone informando que o mês já passou e que a alteração não se propaga automaticamente para os meses seguintes. Botões: "Cancelar" e "Editar mesmo assim" (ou "Cadastrar mesmo assim" se for inclusão).
- [x] 2026-03-24 15:00 — O seletor de ano deve exibir o ano seguinte a partir de dezembro, com apenas janeiro clicável. A cada 1º do mês, o mês seguinte desbloqueia automaticamente.
- [x] 2026-03-24 15:00 — Desabilitar meses futuros além do mês atual + 1. Exemplo: em março, abril fica clicável, maio e além ficam inacessíveis. Em 1º de abril, maio habilita.
- [x] 2026-03-24 15:00 — Ao copiar do mês anterior: se hoje < (1º do mês seguinte − 3 dias), exibir popup avisando que o mês ainda não está no final e que os dados podem estar incompletos. Botões: "Cancelar" e "Copiar mesmo assim".
- [x] 2026-03-24 14:30 — Implementar sininho - ver arquivo dominio.md sessão "sininho".
- [x] 2026-03-24 14:30 — Ao entrar no site pela primeira vez no dia o sistema vai tentar, em background, recuperar as ações e os valores de benchmark da internet. Caso haja problemas, será reportado na área de notificações.
- [x] 2026-03-22 — Criar duas classes de ativos especiais: Ações e FIIs (Fundos Imobiliários). Elas terão uma flag isAcao que, quando verdadeira, terão comportamentos diferentes em relação às demais classes de ativos. Serão consideradas como Classes de Ativos de sistema e por isso não poderão ser removidas na área Classe de Ativos.
- [x] 2026-03-22 — Ao clicar em "Ações Clear", não vai abrir popup igual aos demais produtos — vai direcionar para /acoes, com o filtro em Clear e Ações.
- [x] 2026-03-22 — Em /acoes vamos ter dois filtros: por instituição e por classe de ativo (aqui mostrando apenas as classes com flag isAcao).
- [x] 2026-03-22 — Ter um botão em ações/fiis de refresh que irá atualizar os dados das ações com os valores mais recentes do yahoo finance. Depois de atualizar as ações, o sistema vai agrupar as ações por instituição e gravar em produtos do mês atual o valor final (Ações Clear).
- [x] 2026-03-22 — Ao editar, incluir ou remover uma ação o sistema deve recalcular o agregado imediatamente (usando o preço atual já em cache, sem consultar o Yahoo Finance novamente) e atualizar o agregado em produtos.
- [x] 2026-03-22 — Vamos também criar uma paginação, permitir que o usuário possa escolher a qtd de registros por página (10, 20, 50, 100). Esse valor é guardado nas configs do usuário e sempre que ele entrar o sistema saberá da sua preferência.
- [x] 2026-03-22 — Não há seletor de mês em /acoes. O histórico dos valores mês a mês fica registrado exclusivamente nos produtos agregados ("Ações Clear") em /produtos.
- [x] 2026-03-22 — Os campos de ação são: Ticker, Quantidade, Preço médio de compra.
- [x] 2026-03-22 — Criar filtro de instituição e classe de ativo (que vai mostrar apenas as classes com flag isAcao).
- [x] 2026-03-22 — O cadastro de produtos começará com os campos Categoria e Subcategoria (classe de ativo). Se for escolhida subcategoria que contenha o flag isAcao, um alerta será mostrado orientando o usuário a fazer o cadastro na área Ações/FIIs.
- [x] 2026-03-22 — Recomendado: exibir um aviso sutil no form de edição de "Ações Clear" informando que os valores são gerenciados automaticamente e podem ser sobrescritos pela próxima atualização.
- [x] Trocar texto editar e excluir por ícones padrão do sistema.
- [x] Tem que mostrar na lista o mais recente primeiro e o mais antigo por último.
- [x] No filtro de instituições manter sempre um selecionado não foi uma boa ideia. Permitir que ao clicar em "todos" marque todos; clicando novamente, desmarca todos. Ao desmarcar todos a lista fica zerada. Fazer a mesma coisa pro filtro de categorias.
- [x] Permitir a inclusão de FIIs também? Não, pois na importação seria necessário distinguir o que é ação e o que é FII.
- [x] Em produtos ter um ícone ao lado do editar para registro de dividendos. Dividendos não entram no total do produto pois é um valor que cai na conta corrente. Ao clicar, abre popup para informar dia, valor do dividendo, valor jcp, outros proventos. O sistema inclui a data completa. O usuário pode criar várias linhas. No detalhe do produto incluir o total de dividendos recebidos no mês.
- [x] Criar na área de ações funcionalidade de dividendos, nos mesmos moldes e conceitos da área de produtos.
- [x] O ano em produtos estava escondido na linha dos meses — passado para cima da lista de meses, em combo, permitindo também selecionar o ano global.

---

# FUTURO? - [+]

- [+] Gerar favicon

- [+] Implementar importação de dividendos pra produtos nos moldes de ações.

- [+] Em ações criar um gráfico de evolução da ação apenas com dados do yahoo finance. (pensar depois como algum dado nosso da ação pode ser útil pra interferir no gráfico, como data ou qtd)

- [+] Criar área de produtos por liquidez.

- [+] Criar conta família? vários usuários usando a mesma conta?

- [+] Classe de Ativos — Implementar o conceito de ativo/inativo para classes de ativos e categorias. Uma classe ou categoria inativa não aparece nos formulários de cadastro/edição de produtos, mas continua associada aos produtos existentes sem quebrar histórico. Isso substitui a necessidade de remover registros em uso.

- [+] Cache de Tabelas Auxiliares (ref-cache)

  Contexto

  Atualmente, toda vez que o usuário abre a página de Produtos ou Ações, o sistema busca na API as tabelas auxiliares
  (categorias, classes de ativo, instituições, regiões, liquidez). Esses dados mudam raramente — só quando o usuário
  edita em Configurações. O objetivo é fazer uma única busca e reusar localmente, invalidando apenas a tabela que foi
  alterada.

  ***

  Estratégia: Módulo ref-cache (in-memory + localStorage)
  - In-memory (Map): acesso imediato nas navegações dentro da sessão (ex: sair e voltar para Produtos)
  - localStorage: persiste entre sessões (ex: fechar e reabrir o browser)
  - Invalidação por tabela: cada CRUD de configuração invalida apenas a chave correspondente
  - Sem TTL: os dados são válidos indefinidamente — só invalidam quando há mutação

  Tabelas em cache (5 ref keys)

  ┌──────────────┬───────────────────┬──────────────────────────────────────┐
  │ Key │ Endpoint │ CRUD em │
  ├──────────────┼───────────────────┼──────────────────────────────────────┤
  │ categories │ /api/categories │ /configuracoes/categorias/page.tsx │
  ├──────────────┼───────────────────┼──────────────────────────────────────┤
  │ assetclasses │ /api/assetclasses │ /configuracoes/classes/page.tsx │
  ├──────────────┼───────────────────┼──────────────────────────────────────┤
  │ institutions │ /api/institutions │ /configuracoes/instituicoes/page.tsx │
  ├──────────────┼───────────────────┼──────────────────────────────────────┤
  │ regions │ /api/regions │ /configuracoes/regioes/page.tsx │
  ├──────────────┼───────────────────┼──────────────────────────────────────┤
  │ liquidity │ /api/liquidity │ /configuracoes/liquidez/page.tsx │
  └──────────────┴───────────────────┴──────────────────────────────────────┘

  Não entra em cache: produtos, entries, dividends, ações (dados dinâmicos).

  ***

  Arquivos a criar/modificar
  1.  Novo: web/src/lib/ref-cache.ts

  Módulo singleton simples — sem React, sem Context:

  export type RefKey = 'categories' | 'assetclasses' | 'institutions' | 'regions' | 'liquidity'

  const LS*PREFIX = 'mdd_ref*'
  const mem = new Map<RefKey, unknown[]>()

  export const refCache = {
  get<T>(key: RefKey): T[] | null {
  if (mem.has(key)) return mem.get(key) as T[]
  try {
  const raw = localStorage.getItem(LS*PREFIX + key)
  if (raw) {
  const data = JSON.parse(raw) as T[]
  mem.set(key, data)
  return data
  }
  } catch { /* noop \_/ }
  return null
  },

      set<T>(key: RefKey, data: T[]): void {
      mem.set(key, data)
      try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(data)) } catch { /* noop */ }
      },

      invalidate(key: RefKey): void {
      mem.delete(key)
      try { localStorage.removeItem(LS_PREFIX + key) } catch { /* noop */ }
      },

  } 2. Novo: helper getRef<T> (dentro do próprio ref-cache.ts)

  Evita repetição nos Promise.all das páginas:

  export async function getRef<T>(key: RefKey, endpoint: string): Promise<T[]> {
  const cached = refCache.get<T>(key)
  if (cached) return cached
  const data = await api.get<T[]>(endpoint)
  refCache.set(key, data)
  return data
  }

  ***
  3.  web/src/app/produtos/page.tsx

  Substituir o Promise.all das tabelas auxiliares:

  // Antes:
  api.get<Category[]>('/api/categories'),
  api.get<AssetClass[]>('/api/assetclasses'),
  ...

  // Depois:
  getRef<Category>('categories', '/api/categories'),
  getRef<AssetClass>('assetclasses', '/api/assetclasses'),
  getRef<Institution>('institutions', '/api/institutions'),
  getRef<Region>('regions', '/api/regions'),
  getRef<LiquidityOption>('liquidity', '/api/liquidity'),
  api.get<Product[]>('/api/products'), // produtos: sem cache (dinâmico) 4. web/src/app/acoes/page.tsx

  Substituir as duas chamadas de ref no Promise.all:

  // institutions e assetclasses via getRef; acoes e stock-dividends sem cache:
  getRef<Institution>('institutions', '/api/institutions'),
  getRef<AssetClass>('assetclasses', '/api/assetclasses'), 5. Páginas de Configuração (5 arquivos)

  Após cada mutação (POST, PUT, DELETE), adicionar refCache.invalidate(key):

  ┌─────────────────────────────────────┬───────────────────────────────────────────────────────────────────────┐
  │ Arquivo │ Key a invalidar │
  ├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ configuracoes/categorias/page.tsx │ 'categories' (e também 'assetclasses', pois classes exibem categoria) │
  ├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ configuracoes/classes/page.tsx │ 'assetclasses' │
  ├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ configuracoes/instituicoes/page.tsx │ 'institutions' │
  ├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ configuracoes/regioes/page.tsx │ 'regions' │
  ├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ configuracoes/liquidez/page.tsx │ 'liquidity' │
  └─────────────────────────────────────┴───────────────────────────────────────────────────────────────────────┘

  Padrão de onde inserir (todas as páginas seguem a mesma estrutura):
  // Após api.post / api.put / api.delete bem-sucedido:
  refCache.invalidate('institutions')
  // seguido de: reload local (já existente em cada página)

  ***

  Fluxo após implementação

  Usuário abre Ações
  → getRef('institutions') → cache vazio → busca API → salva cache → exibe
  → getRef('assetclasses') → cache vazio → busca API → salva cache → exibe

  Usuário navega para Produtos
  → getRef('institutions') → HIT in-memory → exibe sem request ✓
  → getRef('categories') → cache vazio → busca API → salva cache → exibe

  Usuário vai em Configurações → Instituições → edita nome
  → refCache.invalidate('institutions')

  Usuário volta para Ações
  → getRef('institutions') → cache vazio → busca API → salva cache → exibe ✓

  ***

  Verificação
  1.  Abrir Ações → DevTools Network → ver requests de /api/institutions e /api/assetclasses
  2.  Navegar para Produtos → Network → não deve ter request para /api/institutions
  3.  Ir em Configurações → Instituições → criar nova → voltar para Ações → deve buscar da API (cache invalidado)
  4.  Recarregar a página (F5) → Produtos → não deve buscar institutions/regions/etc (localStorage hit)
  5.  Abrir aba anônima (limpa localStorage) → primeiro acesso busca tudo da API



- [+] ❯ Vamos conversar, no futuro penso em criar um conceito de conta família. Seria um mecanismo em que vários usuários
acessariam uma mesma conta, ou uma conta pai que desse acesso a outra conta filho a ter acesso aos dados. Pensa sobre
isso e me dê alternativas.

   ● Vou pensar nas alternativas e criar um documento para discutirmos.

   ● Updated plan
   ⎿  /plan to preview
   ⎿  User rejected Claude's plan:
      ╭─────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
      │ Conta Família — Discussão de Alternativas                                                                       │
      │                                                                                                                 │
      │ Contexto                                                                                                        │
      │                                                                                                                 │
      │ O sistema hoje é 100% por usuário (userId em todas as tabelas). Cada Google login é uma conta isolada.          │
      │ A ideia é permitir que múltiplos usuários compartilhem dados financeiros — seja uma conta conjunta, seja uma    │
      │ hierarquia pai/filho.                                                                                           │
      │                                                                                                                 │
      │ ---                                                                                                             │
      │ Alternativas                                                                                                    │
      │                                                                                                                 │
      │ Alternativa 1 — Conta Compartilhada (membros numa carteira)                                                     │
      │                                                                                                                 │
      │ Um usuário cria uma "carteira" e convida outros emails (Google) para acessá-la.                                 │
      │ O convidado entra com seu próprio login e escolhe qual carteira quer operar.                                    │
      │                                                                                                                 │
      │ Carteira "Família Silva"                                                                                        │
      │   ├── Marcelo (dono)                                                                                            │
      │   ├── Maria (editor)                                                                                            │
      │   └── João (visualizador)                                                                                       │
      │                                                                                                                 │
      │ - Permissões: owner / editor / viewer                                                                           │
      │ - O convidado pode ter sua própria carteira separada + acesso à carteira familiar                               │
      │ - Impacto no backend: trocar userId por walletId em todas as tabelas, ou adicionar uma camada de resolução user │
      │  → walletId ativo                                                                                               │
      │ - Prós: modelo mais natural para casal/família gerindo finanças juntos                                          │
      │ - Contras: maior refatoração — todas as queries precisam levar em conta o walletId ativo, não o userId          │
      │                                                                                                                 │
      │ ---                                                                                                             │
      │ Alternativa 2 — Delegação de Acesso (acesso à conta de outro)                                                   │
      │                                                                                                                 │
      │ O usuário A concede ao usuário B acesso à sua conta. B entra com seu login e pode "impersonar" a conta de A.    │
      │                                                                                                                 │
      │ Marcelo concede acesso → Maria                                                                                  │
      │ Maria loga → vê botão "Acessar conta de Marcelo"                                                                │
      │                                                                                                                 │
      │ - Sem novo conceito de carteira — a conta continua sendo do dono                                                │
      │ - Permissões por delegação: leitura ou leitura+escrita                                                          │
      │ - Impacto no backend: tabela AccountDelegate (ownerId, delegateId, role) + middleware que troca o userId        │
      │ efetivo na request                                                                                              │
      │ - Prós: menor refatoração — o conceito de userId por owner se mantém, só muda quem está "atrás do volante"      │
      │ - Contras: sem separação de dados individuais; o delegado vê tudo do dono                                       │
      │                                                                                                                 │
      │ ---                                                                                                             │
      │ Alternativa 3 — Conta Pai/Filho (hierarquia)                                                                    │
      │                                                                                                                 │
      │ Um usuário pai gerencia várias contas filho independentes. Cada filho tem seus próprios dados, o pai pode       │
      │ visualizar/consolidar todos.                                                                                    │
      │                                                                                                                 │
      │ Marcelo (pai)                                                                                                   │
      │   ├── vê consolidado de todos                                                                                   │
      │   ├── Conta própria                                                                                             │
      │   ├── Maria (filho) — conta independente                                                                        │
      │   └── João (filho) — conta independente                                                                         │
      │                                                                                                                 │
      │ - Cada filho opera normalmente sua própria conta                                                                │
      │ - O pai tem uma visão consolidada (dashboard agregado)                                                          │
      │ - Impacto no backend: tabela FamilyMember (parentId, childId) + endpoints de consolidação cross-user            │
      │ - Prós: preserva autonomia individual; ótimo para pais acompanhando filhos                                      │
      │ - Contras: maior complexidade (dashboard consolidado é novo); filhos não veem dados uns dos outros              │
      │                                                                                                                 │
      │ ---                                                                                                             │
      │ Alternativa 4 — Múltiplas Carteiras por Usuário (sem compartilhamento direto)                                   │
      │                                                                                                                 │
      │ Um usuário pode criar N carteiras (ex: "Pessoal", "Família", "Empresa").                                        │
      │ Cada carteira é isolada. Compartilhamento futuro seria por carteira, não por conta.                             │
      │                                                                                                                 │
      │ Marcelo                                                                                                         │
      │   ├── Carteira "Pessoal"                                                                                        │
      │   └── Carteira "Família" ← poderia ser compartilhada no futuro                                                  │
      │                                                                                                                 │
      │ - Não resolve o compartilhamento agora, mas prepara a arquitetura para qualquer modelo futuro                   │
      │ - Impacto: grande refatoração — todas as tabelas ganham walletId                                                │
      │ - Prós: mais flexível a longo prazo                                                                             │
      │ - Contras: o maior esforço de todos; sem valor imediato para o usuário                                          │
      │                                                                                                                 │
      │ ---                                                                                                             │
      │ Comparativo                                                                                                     │
      │                                                                                                                 │
      │ ┌─────────────────────────────┬─────────────────────┬───────────────────┬─────────────────┬──────────────────── │
      │ ──┐                                                                                                             │
      │ │          Critério           │ Alt 1 Compartilhada │  Alt 2 Delegação  │ Alt 3 Pai/Filho │ Alt 4               │
      │ Multi-carteira │                                                                                                │
      │ ├─────────────────────────────┼─────────────────────┼───────────────────┼─────────────────┼──────────────────── │
      │ ──┤                                                                                                             │
      │ │ Esforço de refatoração      │ Alto                │ Médio             │ Médio           │ Muito alto          │
      │   │                                                                                                             │
      │ ├─────────────────────────────┼─────────────────────┼───────────────────┼─────────────────┼──────────────────── │
      │ ──┤                                                                                                             │
      │ │ Caso de uso casal           │ ✓ Ótimo             │ ✓ Bom             │ ✗ Não ideal     │ ✓ Com esforço       │
      │   │                                                                                                             │
      │ ├─────────────────────────────┼─────────────────────┼───────────────────┼─────────────────┼──────────────────── │
      │ ──┤                                                                                                             │
      │ │ Caso de uso pais/filhos     │ ✗ Não ideal         │ ✓ Razoável        │ ✓ Ótimo         │ ✓ Com esforço       │
      │   │                                                                                                             │
      │ ├─────────────────────────────┼─────────────────────┼───────────────────┼─────────────────┼──────────────────── │
      │ ──┤                                                                                                             │
      │ │ Dados individuais separados │ ✗ Tudo junto        │ ✗ Tudo junto      │ ✓ Separados     │ ✓ Separados         │
      │   │                                                                                                             │
      │ ├─────────────────────────────┼─────────────────────┼───────────────────┼─────────────────┼──────────────────── │
      │ ──┤                                                                                                             │
      │ │ Permissões granulares       │ ✓ owner/editor/view │ ✓ leitura/escrita │ ✗ Binário       │ ✓ Por carteira      │
      │   │                                                                                                             │
      │ ├─────────────────────────────┼─────────────────────┼───────────────────┼─────────────────┼──────────────────── │
      │ ──┤                                                                                                             │
      │ │ Menor risco de bugs         │ Médio               │ ✓ Menor           │ Médio           │ Alto                │
      │   │                                                                                                             │
      │ └─────────────────────────────┴─────────────────────┴───────────────────┴─────────────────┴──────────────────── │
      │ ──┘                                                                                                             │
      │                                                                                                                 │
      │ ---                                                                                                             │
      │ Recomendação para discussão                                                                                     │
      │                                                                                                                 │
      │ Para o perfil do sistema (gestão pessoal de patrimônio), Alt 2 (Delegação) tem o melhor custo/benefício no      │
      │ curto prazo:                                                                                                    │
      │ - Menor mudança arquitetural                                                                                    │
      │ - Resolve o caso mais comum (cônjuge acompanhando)                                                              │
      │ - Pode ser expandida para Alt 1 depois se necessário                                                            │
      │                                                                                                                 │
      │ Se o foco for acompanhamento de filhos adultos/dependentes, Alt 3 (Pai/Filho) é mais adequada.                  │
      │                                                                                                                 │
      │ As duas podem coexistir: começa com Delegação e adiciona visão consolidada depois.  

---

# NÃO IMPLEMENTADOS - [-]

- [-] Fechamento/abertura de mês — Um mês poderia estar em dois estados: aberto ou fechado. Mês fechado bloquearia qualquer edição. Um botão de alternância permitiria mudar o estado com confirmação. Substituído por regras de aviso baseadas em data e danger zone para edições em meses passados.
- [-] Produtos — Ao fechar o mês atual, o sistema tentaria automaticamente recuperar os valores das ações e recalcular os valores agrupados. Substituído pela recuperação automática diária ao entrar no site.
