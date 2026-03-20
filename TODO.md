# Em Andamento

- [ ] faça o item dashboard

# FASE FRONTEND

## Geral

- [ ] Gerar favicon

## Dashboard

- [ ] criar novo item de menu chamado dividendos, esta área vai mostrar o consolidado recebido de dividendos mes a mes, últimos 12 meses do ano selecionado. Se ano atual, mostra os ultimos 12 meses, se ano antigo, mostra os 12 meses do ano. A tela segue o mesmo estilo da área consolidado mensal. Filtros somente de instituições, não tem categorias. Nas colunas vai ter o mes/ano, percentual de evolução comparado com o valor total do mes anterior, se não tem nada no mes anterior, mostra um tracinho, e o valor total do dividendo, ao clicar nesse linha (toda a linha é clicável) abre popup mostrando todos os produtos que geraram dividendos naquele mes, com ordem de maior dividendo pro menor, agrupado por instituição. Nessa lista mostra o ativo, qual instituição e valor do dividendo (dividendo total = dividendo + jcp + outros). Tem um botão de fechar o popup ou ao clicar fora ele volta pra lista.

## Produtos

- [ ] 



ver alguma forma de transpor as ações para produtos no final do mes. Talvez criar a ideia de fechamento de mes/reabertura de mes, e impedir mudanças nos dados de produtos meses fechados. Ao trancar o mes importo as ações. Ter um botão pra importar as ações sempre que eu desejar.

## Ações

## Dividendos

- [ ] Criar uma área para acompanhar dividendos, seja de ações, fundos ou fiis.

## Criar área benchmark

- Vai ser acessada pelo menu lateral em configurações, item abaixo de cotação.
- Esta área vai ter um histórico de valores de paupança, CDI, Inflação, Bolsa Brasil, por mes (sempre o valor do ultimo dia do mes) que poderá ser editada.
- Esta área tb é populada quando o usuário é cadastrado.
- O sistema pega da internet? como? onde? quando?
- Esta área vai ser usada futuramente no overview do dashboard para comparar seus rendimentos com os diversos benchmarks disponíveis.

## Mock inicial - fase de teste

- Ao criar um novo usuário os mocks devem gerar informação de produtos de abril/2024 até o mes/ano atual. Cada mês, inciando em abril/2024 deve ser a evolução do anterior, com mais produtos, e produtos com valor mais alto, até um total no mes/ano atual de 1 milhão de reais e 25 produtos.
- O mock de categorias, instituições e classes de ativos e liquides deve buscar as mais usadas no mercado financeiro, as principais.

---

# FASE BACKEND

## Seed do prisma - fase de produção

- Ao criar um novo usuário deve-se popular o mes corrente com 2 produtos de exemplo, deve popular as tabelas de categorias, classes de ativos, instituições, regiões, liquidez e cotação conforme regra de seed de primeiro cadastro

  ### Regra de seed de primeiro cadastro

      -

# Concluído

- [x] Trocar texto editar e excluir por icones padrão do sistema.
- [x] tem que mostrar na lista o mais recente primeiro e o mais antigo por último.
- [x] no filtro de instituições manter sempre um selecionado não foi uma boa ideia, permita que ao clicar em todos, marque todos, clicando novamente, desmarca todos. ao desmarcar todos a lista fica zerada. Fazer a mesma coisa pro filtro de categorias.
- [x] permitir a inclusão de fiis tb? não né. pq aí pra importar ia complicar, teria que distinguir o que é acção e o que é fiis.
- [x] Em produtos ter um ícone ao lado do editar para registro de dividendos. Dividendos não entram no total do produto pois é um valor que cai na conta corrente, esses valores só serão mostrados em relatórios. Ao clicar no botão, abre popup com a possibilidade de colcoar dia(já vem pre-prenchido com o dia de hoje)(mes e ano já está informado pelos ano e mes selecionados)(o usuário vai informar só o dia, mas o sistema vai incluir a data toda, pra futuros relatórios), valor do dividendo, valor jcp, outros proventos. Usuário preenche os campos e salva, sistema mostra total, ele pode criar várias linhas de dividendos. A informação de total de dividendo é usada para calcular ganhos e rentabilidade. No detalhe do produto incluir a informação total de dividendos recebidos (vai ser o total de dividendos recebidos naquele mes.)
- [x] criar no area de ações funcionalidade de dividendos, nos mesmos moldes e conceitos da área de produtos
- [x] o ano em produtos está escondido na linha dos meses, passe o ano pra cima da lista de meses, numa compo, será possível também selecionar o ano global por aqui.


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

