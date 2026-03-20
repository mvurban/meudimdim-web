## plano pra mudança de produtos e ações:

Plano: Ações como Produtos

Contexto

Atualmente ações ficam em uma área separada (/acoes) com armazenamento isolado (localStorage acoes). O problema: elas não entram no consolidado mensal, e criar um mecanismo de "fechamento de mês" seria não-intuitivo e propenso a  
 erro. A solução é tratar ações como produtos, com uma flag isAcao, mantendo a tela de ações com a mesma UX de hoje mas lendo/gravando da tabela de produtos.

Comportamento esperado

- Ações são cadastradas e editadas na tela /acoes — mesma UI de hoje
- Internamente, são salvas como Product + ProductEntry (com flag isAcao: true)
- Na tela de produtos, ações NÃO aparecem individualmente — aparece uma linha resumo "Ações · R$ X.XXX" clicável que leva para /acoes
- O consolidado mensal passa a incluir as ações automaticamente (são produtos)
- Dividendos de ações já usam productId — funcionam sem mudança

---

Mudanças necessárias

1.  src/types/index.ts

Estender Product e ProductEntry com campos opcionais para ações:

// Em Product — adicionar:
isAcao?: boolean
ticker?: string // ex: "PETR4"
precoMedio?: number // preço médio de compra

// Em ProductEntry — adicionar:
quantidade?: number // qtd de ações naquele mês
precoAtual?: number // preço atual no mês
precoFechamento?: number // preço de fechamento

2.  src/lib/mock-store.ts

- Remover AcaoItem interface e funções getAcoes/setAcoes
- Remover DEFAULT_ACOES e mockPrecos
- Criar função getAcaoProducts(email) que retorna products.filter(p => p.isAcao) lendo do mesmo storage de produtos
- Migrar dados mock de ações para criar Products+ProductEntries com isAcao: true

3.  src/app/acoes/page.tsx

- Substituir leitura de getAcoes() por leitura de produtos com isAcao: true
- startAdd → cria um Product (isAcao, ticker, precoMedio, institutionId) + ProductEntry do mês atual (quantidade, precoAtual, valueBrl = qtd × precoAtual, returnPct)
- startEdit → edita o Product e o ProductEntry do mês atual
- remove → remove o Product e todas suas ProductEntries
- Manter toda a UI de exibição igual (ticker badge, rendimento, etc.)
- Manter AcaoDividendModal — já usa acaoId que passará a ser o productId

4.  src/app/produtos/page.tsx

- Filtrar products para não exibir isAcao: true nos grupos normais
- Após os grupos, se houver ações no mês, exibir uma linha resumo:
  [ Ações · 12 ativos · R$ 234.500 → ver ações ]
- Clicar nessa linha navega para /acoes

5.  src/components/acoes/AcaoProductModal.tsx (novo)

Modal dedicado para cadastro/edição de ação — formulário simplificado:

Campos visíveis:

- Ticker (ex: PETR4)
- Quantidade
- Preço Médio de Compra (R$)
- Instituição
- Categoria — select pré-selecionado com "Renda Variável" se existir na config do usuário, senão vazio
- Classe de Ativo — select filtrado pela categoria selecionada, pré-selecionado com "Ações" se existir

Campos auto-preenchidos silenciosamente:

- regionId → primeiro com isDefault: true, ou primeiro da lista
- liquidityId → primeiro da lista (D+0 geralmente)
- name → usar o próprio ticker como nome do produto
- isAcao: true

Por que não hardcodar IDs:

- Categorias e classes de ativo são per-user e podem ser deletadas pelo usuário
- Pré-selecionar por nome ("Renda Variável", "Ações") é mais robusto que por ID
- Se não encontrar, usuário escolhe explicitamente — sem quebra silenciosa
- Importante ser desse jeito porque o produto pode ser um etf internacional, que pode ter a categoria internacional, fiis e bdrs.

6.  src/components/produtos/CategoryGroup.tsx ou página

- Garantir que o filtro de categoria não exibe ações individuais

7.  src/lib/mock-data.ts

- Adicionar produtos mock com isAcao: true (mover os 12 ativos de DEFAULT_ACOES)
- Gerar ProductEntries mensais para esses produtos com quantidade, precoAtual, valueBrl

---

Arquivos críticos

┌───────────────────────────────────────────┬──────────────────────────────────────────────────────────┐
│ Arquivo │ Mudança │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
│ src/types/index.ts │ Estender Product e ProductEntry │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
│ src/lib/mock-store.ts │ Remover AcaoItem, adaptar para produtos │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
│ src/lib/mock-data.ts │ Adicionar produtos mock isAcao │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
│ src/app/acoes/page.tsx │ Ler/gravar via produtos │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
│ src/app/produtos/page.tsx │ Linha resumo de ações │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
│ src/app/acoes/page.tsx (modal) │ Formulário simplificado: ticker, qtd, preço, instituição │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────┤
│ src/components/acoes/AcaoProductModal.tsx │ Novo modal simples para cadastro de ação (recomendado) │
└───────────────────────────────────────────┴──────────────────────────────────────────────────────────┘

---

Verificação

1.  Abrir /acoes — exibe as ações com a mesma UI de hoje
2.  Adicionar uma nova ação — aparece na lista de ações E no resumo de produtos
3.  Abrir /produtos — não aparece a ação individualmente, aparece linha "Ações · R$ X"
4.  Clicar na linha "Ações" → navega para /acoes
5.  Abrir consolidado mensal — o valor das ações entra nos totais mensais



# Conceito sobre produtos
1- Produtos vai continuar exibindo todas as categorias com todas as classes de ativos.
2- Produtos são exibidos por mes, todo mes temos um retrato (snapshot) dos valores daquele mes. Ao acessar um mês no passado, nenhum valor é recalculado, o que passou fica como histórico imutável. (Ver fechamento/abertura de mes)
3- Ao resgatar os produtos da base de dados do mes corrente, que ainda está aberto, o sistema vai identificar as ações e fiis e criar registros em produtos dessa forma: Produto- Ações Clear, rent. média, aporte (aqui entra valor manual, não busca nada em ações), retirada (mesma coisa de aporte),ganhos (aqui compara com ações clear do mes passado), total (valor consolidado de todas as ações da instituição clear, naquele momento. Aqui podemos pensar num cache e qndo o usuário clicar em algum lugar a gente recalcula. Ou entrar como um texto - recuperar valor atual no lugar do valor pra não deixar a área demorar muito pra carregar, se ele clica calculamos o valor e guardamos, se ele entrar na área ações, podemos fazer a mesma coisa.)
4- Ao clicar em ações clear, não vai abri popup igual aos demais produtos, vai direcionar pra ações, com o filtro em clear e ações.
5- Em ações vamos ter dois filtros, por instituição e por classes de ativos(aqui só mostrando ações e fiis)
6- Pra isso vamos ter que ter um flag em renda variável /acao e renda variável/ fiis que nos permita criar essas situações especiais.
7- Esses itens especiais de categoria, classe de ativos não poderão ser removidos das suas respectivas áreas (tabelas de referencia/auxiliares)
8- Produtos podem ser removidos dos meses em aberto, temos que criar um botão para remover.
9- Ter uma área em produtos que possa resgatar todas as ações/fiis e atualizar produtos, pois posso querer saber no meio do mes, quanto tenho no consolidado atual. Neste caso fazemos os calculos e gravamos em produtos os somatorios das ações/fiis para cada instituição (lembra vai ser ações clear, ações xp, fiis itau, fiis nu).


## Copiar do mês anterior
A função "copiar do mês anterior" só permite copiar do mes se ele estiver fechado, ao tentar copiar de um mes aberto, sistema abre janela informando que o mes ainda se encontra em aberto e pergunta se deseja fechar o mes, se clicar em deseja fechar, ele fecha o mes anterior e copia pro mes atual/seguinte dependendo de que botão for clicado (de dentro do mes corrente ou do mes seguinte).


## Fechamento/abertura de mes
Um mês pode estar em dois estados: aberto ou fechado.

Mês aberto: permite todas as operações normais — incluir, editar e remover produtos, alterar valores e registrar dividendos.
Mês fechado: bloqueia qualquer edição. Nenhum produto pode ser incluído, modificado ou ter dividendos cadastrados.

Um botão de alternância permite mudar o estado do mês. Ao acioná-lo, o sistema solicita confirmação antes de aplicar a mudança — tanto para fechar quanto para reabrir.

Ao tentar editar, incluir um produto ou cadastrar dividendos em um mês fechado, o sistema exibe um alerta informando que o mês está fechado e pergunta se o usuário deseja reabri-lo para edição.

Ao acionar o fechamento, o dialog de confirmação exibe a opção "Atualizar Ações e FIIs" como um checkmark. O usuário marca ou desmarca conforme desejado e clica em confirmar. Uma segunda tela resume o impacto da escolha — informando se Ações e FIIs serão ou não computados no consolidado geral. Se confirmar, o sistema processa de acordo. Se cancelar, retorna ao dialog anterior para que ele revise a seleção.

Desabilitar a opção "Atualizar Ações e FIIs" para meses que não sejam o mês atual — a opção simplesmente não aparece ao fechar um mês passado, neste caso fecha o mes, sem atualizar as ações.


Plano formalizado em 8 passos incrementais. Resumo:

  1. Flag isSystem em Category/AssetClass — proteger Renda Variável, Ações BR, FII de deleção
  2. Modelo de status do mês — tipo MonthStatus + funções de storage (sem UI ainda)
  3. UI de fechamento/abertura em /produtos — botão toggle + bloqueio de edições
  4. Copiar mês anterior exige mês anterior fechado
  5. Produtos agregados no mock-data — "Ações Clear", "FIIs XP" aparecem em /produtos
  6. Botão "Atualizar Ações e FIIs" — só no mês atual aberto
  7. Fechamento inclui opção de atualizar ações antes de travar
  8. Filtros em /acoes por instituição e classe de ativo