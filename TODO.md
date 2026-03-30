# REGRAS - todo.md para uso da IA.

## Convenção de marcadores

- `- [ ]` = tarefa pendente a implementar
- `- [x]` = tarefa concluída → vai para `# CONCLUÍDOS - [x]`
- `- [+]` = proposta futura (pode ou não ser produzida) → vai para `# FUTURO? - [+]`
- `- [-]` = proposta cancelada / não implementada → vai para `# NÃO IMPLEMENTADOS - [-]`

## Fluxo principal

1. Ler o todo.md completo
2. Identificar os itens do tópico "Em Andamento"
3. Executar item por item
4. Ao final de cada item, perguntar se pode prosseguir para o próximo
5. À medida que conclui cada item, marcar com [x] no todo.md
6. Ao finalizar todos os itens, perguntar se o usuário quer mover os concluídos para "# CONCLUÍDOS - [x]"
7. Ao mover, replicar o texto exato precedido de data e hora: `- [x] 2026-03-22 14:30 — texto original da tarefa`
8. Sempre inserir os recém-concluídos no topo da seção, empurrando os mais antigos para baixo.

Regra especial — itens ponteiros:

Se um item em "Em Andamento" aponta para outro (ex: "faça o item dashboard", "faça o primeiro item de Produtos"):

- Executa o item apontado
- Move o item apontado para Concluídos (com data/hora + texto exato)
- Apaga o ponteiro do "Em Andamento" — ele não vai para Concluídos
- O ponteiro é descartável após cumprir sua função

---

## Em Andamento

- [x] os dividendos de uma ação devem mudar o rend. total, mas não o valor total. Apenas coloca o dividendo como parte do rendimento da ação, apenas total, sem mexer no diário.
- [x] vamos criar um sinal no cabeçalho com um i de informação ou algo do tipo pra quando o usuário ponterar o mouse, poder ver um tooltip com uma explicação. Isso vai ser padrão no sistema todo, o mesmo simbolo.
- [x] uma dúvida a barra de progresso sendo feita um a um demora mais? se sim atualize a barra de 3 em 3 açoes, senão, mantém.
- [ ] fechamento ainda com valor errado. Veja na internet como se busca esse valor.
- [ ] Ao abrir a lista de ações pela primeira vez, deixe o rendimento do dia como ordenado do maior pro menor.


---

## Geral

## Dashboard

## Produtos

---

## Copiar do mês anterior

---

## Classe de Ativos

---

## Ações

---

## Dividendos

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

- [+] Em ações criar um gráfico de evolução da ação apenas com dados do yahoo finance. (pensar depois como algum dado nosso da ação pode ser útil pra interferir no gráfico, como data ou qtd)

- [+] Criar área de produtos por liquidez.

- [+] Classe de Ativos — Implementar o conceito de ativo/inativo para classes de ativos e categorias. Uma classe ou categoria inativa não aparece nos formulários de cadastro/edição de produtos, mas continua associada aos produtos existentes sem quebrar histórico. Isso substitui a necessidade de remover registros em uso.

- [+] Cache de Tabelas Auxiliares (ref-cache)

   Contexto

   Atualmente, toda vez que o usuário abre a página de Produtos ou Ações, o sistema busca na API as tabelas auxiliares
   (categorias, classes de ativo, instituições, regiões, liquidez). Esses dados mudam raramente — só quando o usuário
   edita em Configurações. O objetivo é fazer uma única busca e reusar localmente, invalidando apenas a tabela que foi
   alterada.

   ---
   Estratégia: Módulo ref-cache (in-memory + localStorage)

   - In-memory (Map): acesso imediato nas navegações dentro da sessão (ex: sair e voltar para Produtos)
   - localStorage: persiste entre sessões (ex: fechar e reabrir o browser)
   - Invalidação por tabela: cada CRUD de configuração invalida apenas a chave correspondente
   - Sem TTL: os dados são válidos indefinidamente — só invalidam quando há mutação

   Tabelas em cache (5 ref keys)

   ┌──────────────┬───────────────────┬──────────────────────────────────────┐
   │     Key      │     Endpoint      │               CRUD em                │
   ├──────────────┼───────────────────┼──────────────────────────────────────┤
   │ categories   │ /api/categories   │ /configuracoes/categorias/page.tsx   │
   ├──────────────┼───────────────────┼──────────────────────────────────────┤
   │ assetclasses │ /api/assetclasses │ /configuracoes/classes/page.tsx      │
   ├──────────────┼───────────────────┼──────────────────────────────────────┤
   │ institutions │ /api/institutions │ /configuracoes/instituicoes/page.tsx │
   ├──────────────┼───────────────────┼──────────────────────────────────────┤
   │ regions      │ /api/regions      │ /configuracoes/regioes/page.tsx      │
   ├──────────────┼───────────────────┼──────────────────────────────────────┤
   │ liquidity    │ /api/liquidity    │ /configuracoes/liquidez/page.tsx     │
   └──────────────┴───────────────────┴──────────────────────────────────────┘

   Não entra em cache: produtos, entries, dividends, ações (dados dinâmicos).

   ---
   Arquivos a criar/modificar

   1. Novo: web/src/lib/ref-cache.ts

   Módulo singleton simples — sem React, sem Context:

   export type RefKey = 'categories' | 'assetclasses' | 'institutions' | 'regions' | 'liquidity'

   const LS_PREFIX = 'mdd_ref_'
   const mem = new Map<RefKey, unknown[]>()

   export const refCache = {
      get<T>(key: RefKey): T[] | null {
      if (mem.has(key)) return mem.get(key) as T[]
      try {
         const raw = localStorage.getItem(LS_PREFIX + key)
         if (raw) {
            const data = JSON.parse(raw) as T[]
            mem.set(key, data)
            return data
         }
      } catch { /* noop */ }
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
   }

   2. Novo: helper getRef<T> (dentro do próprio ref-cache.ts)

   Evita repetição nos Promise.all das páginas:

   export async function getRef<T>(key: RefKey, endpoint: string): Promise<T[]> {
      const cached = refCache.get<T>(key)
      if (cached) return cached
      const data = await api.get<T[]>(endpoint)
      refCache.set(key, data)
      return data
   }

   ---
   3. web/src/app/produtos/page.tsx

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
   api.get<Product[]>('/api/products'),  // produtos: sem cache (dinâmico)

   4. web/src/app/acoes/page.tsx

   Substituir as duas chamadas de ref no Promise.all:

   // institutions e assetclasses via getRef; acoes e stock-dividends sem cache:
   getRef<Institution>('institutions', '/api/institutions'),
   getRef<AssetClass>('assetclasses', '/api/assetclasses'),

   5. Páginas de Configuração (5 arquivos)

   Após cada mutação (POST, PUT, DELETE), adicionar refCache.invalidate(key):

   ┌─────────────────────────────────────┬───────────────────────────────────────────────────────────────────────┐
   │               Arquivo               │                            Key a invalidar                            │
   ├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
   │ configuracoes/categorias/page.tsx   │ 'categories' (e também 'assetclasses', pois classes exibem categoria) │
   ├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
   │ configuracoes/classes/page.tsx      │ 'assetclasses'                                                        │
   ├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
   │ configuracoes/instituicoes/page.tsx │ 'institutions'                                                        │
   ├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
   │ configuracoes/regioes/page.tsx      │ 'regions'                                                             │
   ├─────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
   │ configuracoes/liquidez/page.tsx     │ 'liquidity'                                                           │
   └─────────────────────────────────────┴───────────────────────────────────────────────────────────────────────┘

   Padrão de onde inserir (todas as páginas seguem a mesma estrutura):
   // Após api.post / api.put / api.delete bem-sucedido:
   refCache.invalidate('institutions')
   // seguido de: reload local (já existente em cada página)

   ---
   Fluxo após implementação

   Usuário abre Ações
      → getRef('institutions') → cache vazio → busca API → salva cache → exibe
      → getRef('assetclasses') → cache vazio → busca API → salva cache → exibe

   Usuário navega para Produtos
      → getRef('institutions') → HIT in-memory → exibe sem request ✓
      → getRef('categories')   → cache vazio → busca API → salva cache → exibe

   Usuário vai em Configurações → Instituições → edita nome
      → refCache.invalidate('institutions')

   Usuário volta para Ações
      → getRef('institutions') → cache vazio → busca API → salva cache → exibe ✓

   ---
   Verificação

   1. Abrir Ações → DevTools Network → ver requests de /api/institutions e /api/assetclasses
   2. Navegar para Produtos → Network → não deve ter request para /api/institutions
   3. Ir em Configurações → Instituições → criar nova → voltar para Ações → deve buscar da API (cache invalidado)
   4. Recarregar a página (F5) → Produtos → não deve buscar institutions/regions/etc (localStorage hit)
   5. Abrir aba anônima (limpa localStorage) → primeiro acesso busca tudo da API



---

# NÃO IMPLEMENTADOS - [-]

- [-] Fechamento/abertura de mês — Um mês poderia estar em dois estados: aberto ou fechado. Mês fechado bloquearia qualquer edição. Um botão de alternância permitiria mudar o estado com confirmação. Substituído por regras de aviso baseadas em data e danger zone para edições em meses passados.
- [-] Produtos — Ao fechar o mês atual, o sistema tentaria automaticamente recuperar os valores das ações e recalcular os valores agrupados. Substituído pela recuperação automática diária ao entrar no site.
