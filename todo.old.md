# RESPOSTAS.md
Pontas soltas encontradas

  1. Atualização automática (ponto 3.1) — qual mês?
  Não está dito que a atualização automática diária afeta apenas o mês atual aberto. Se omitir isso, o comportamento em meses passados fica ambíguo.
R.: A atualização automática nada tem haver com mês, ela se refere ao preço atual dos tickers das ações. Não atualiza nada em produtos automaticamente aqui. Atualiza somente os valores individuais de cada ação.

  2. Fechamento incompleto
  A seção "Fechamento/abertura de mes" ficou mais enxuta do que os arquivos anteriores. Faltam:
  - O dialog de confirmação com a opção "Atualizar Ações e FIIs" como checkbox
  - A segunda tela de confirmação com resumo do impacto (fechar com ou sem atualizar ações)
  - A regra de desabilitar essa opção para meses que não sejam o atual
R.: O dialog de confirmação permanece, mas sem a opção do "atualizar ações" pq se for o mes corrente sempre vai tentar atualizar as ações e se não for o mes corrente nunca vai tentar atualizar as ações.

  3. Edição de produto existente com classe isAcao (Decisão D incompleta)
  O alerta está descrito apenas para o cadastro. Falta cobrir: ao editar um produto existente que já tenha classe isAcao, o comportamento deve ser o mesmo (bloquear e redirecionar). Caso contrário, o usuário consegue entrar no form 
  de edição de "Ações Clear" via /produtos.
R.: Sim, ele deve poder entrar em Ações Clear via produtos e alterar os valores desse item como se fosse um produto normal. Se isso acontecer, por exemplo transformando esse produto numa renda fixa, a próxima vez que o sitema receber a instrução para atualizar as ações em produtos, seja no fechamento ou na atualização da área ações (botão de recuperar novamente os dados do yahoo finance), se não existir o item "Ações clear", pq o usuário alterou, o sistema vai criar um novo item produtos chamado "Ações Clear" contendo os dados agrupados dos valores das ações.

  4. Trigger de criação dos produtos agregados
  O ponto 2 diz que "o sistema vai identificar as ações e criar registros em produtos". Mas não define quando isso acontece:
  - Ao acessar /produtos (lazy, calcula na hora)?
  - Sempre que uma ação é adicionada/editada em /acoes (proativo)?
  - Só quando o usuário clicar em "Atualizar"?
  Sem isso definido, a implementação pode tomar um caminho e a UX outro.

R.: Assim que as ações forem atualizadas com sucesso através do yahoo finance, o sistema vai recalcular o valor total por instituição e atualizar a tabela de produtos com o novo valor agrupado. Seja no fechamento ou quando o usuário entrar pela primeira vez no dia, ou quando explicitamente clicar em atualizar dentro de ações.


  5. Copiar mês anterior + ações
  Quando copia o mês anterior, o que acontece com os produtos agregados ("Ações Clear")? Eles devem ser recriados a partir das ações individuais (não copiados com o valor antigo), ou o usuário copia um valor já desatualizado? Isso não está definido.
R.: Quando copia o mes anterior o mes anterior deve estar fechado. Ao fechar o mês, o sistema  tenta automaticamente recuperar os valores das ações e recalcular os valores agrupados. Se não conseguir, mostrar alerta da falha, dar a opção de continuar com os valores atuais ou cancelar. Em meses que não o atual, o sistema não atualiza os valores das ações, se o usuário desejar poderá alterar manualmente o valor total agrupado.

  6. Aporte e retirada ao copiar
  O ponto 2.3 define que aporte e retirada são manuais. Se o usuário copiar o mês anterior, esses campos devem ser zerados no novo mês (são eventos pontuais, não persistem de mês em mês). Não está dito.
R.: Fiz a anotação

  7. Rentabilidade no primeiro mês
  O ponto 2.2 diz que ganhos e rent. média comparam com o mês anterior. Se for o primeiro mês com "Ações Clear" (sem mês anterior), o que exibir? Um traço (—)? Zero? Isso precisa estar definido.
R.: Fiz a anotação

  8. Remover "Ações Clear" em /produtos
  O ponto 8 diz que produtos podem ser removidos. Se o usuário remover "Ações Clear", as ações individuais em /acoes continuam existindo? A resposta provavelmente é sim — mas precisa estar explícito, e o produto agregado deve poder ser recriado pela atualização.
R.: Fiz a anotação

  9. Notificações (sininho)
  Os pontos 3.1 e 3.2 referenciam um sistema de sininho/notificações que ainda não foi planejado. É uma dependência nova que pode impactar escopo.
R.: Vamos planejar no decorrer do sistema.

Melhorias:

A- ok
b- depois que o plano estiver estruturado, vou criar todas as tarefas bem definidas
c- Sim, isso mesmo, com certeza
d- Coloquei uma observação
e- Isso não existe, "copiar mes anterior" para ações. Ações são únicas e não são replicadas mes a mes. Os produtos agregados, sim. São o resultado consolidado das ações mes a mes.

## Novas Respostas
Pontos 1 e 4 se contradizem levemente: 
R.: Verdade, tem razão e a resposta é: atualização diária atualiza tickers E produtos

Uma dúvida nova criada pela resposta E:
Se ações "são únicas e não são replicadas mês a mês", quando o usuário acessa /acoes em um mês passado (ex: novembro/2025), o que ele vê? As ações com os valores atuais de hoje, ou os valores que elas tinham em novembro? Se for um   snapshot histórico, como ele é armazenado?
R.: As ações com os valores atuais de hoje. Talvez tenhamos que deixar claro no texto que as ações são Ações da carteira atual.



==============================================================================================================

# TODO.NEW.md

## Conceito sobre produtos e integração com ações

## Produtos

1. Produtos são exibidos por mês. Todo mês temos um retrato (snapshot) dos valores daquele mês. Ao acessar um mês no passado, nenhum valor é recalculado, o que passou fica como histórico. (Ver Fechamento/abertura de mês)

2. Ao resgatar os produtos da base de dados do mês corrente, que ainda está aberto, o sistema vai identificar as ações e fiis e criar registros em produtos dessa forma: ícone da instituição, Nome do Produto, rent. média, aporte, retirada, ganhos, dólar e total. Da mesma forma como em produtos normais. Esses dados vem da base de dados produtos.

   2.1 - O nome do produto será formado por Classe do ativo + Instituição. Ex.: Ações Clear, FIIs Itaú. O valor total desse produto será a soma do valor total de cada ação/fii agrupados por instituição.

   2.2 - Os valores de rent. média e ganhos são calculados comparando com o mesmo produto do mês anterior. Se não existir mês anterior, o valor deve ser um "-".

   2.3 - Aporte e retirada — aqui entra valor manual, não busca nada em ações.

   2.4 - O valor total de "Ações Clear" será o que está no banco de dados de produtos.

   2.5 - O valor em dólar é apenas o valor total do produto convertido em dólar através da cotação daquele mês (ainda vamos definir a cotação).

3. Atualização dos valores das ações:

   3.1 - O preço atual das ações será atualizado sempre que o usuário entrar no site pela primeira vez naquele dia em background. Caso não consiga recuperar o valor das ações/fiis do Yahoo Finance, o sistema registra uma mensagem de alerta (sininho fica em vermelho com o número 1 ou mensagem +1). Se conseguir, atualiza os valores individuais de cada ação e em seguida recalcula os valores agrupados em produtos.

   3.2 - O valor das ações também será atualizado quando o usuário explicitamente atualizar as cotações na área de Ações (vamos criar esta funcionalidade). Neste caso abre um popup com andamento da solicitação, barra de progresso e botão para executar em background ou cancelar. Emite mensagem no sininho.

   3.3 - Assim que as ações forem atualizadas com sucesso através do Yahoo Finance, o sistema vai recalcular o valor total por instituição e atualizar a tabela de produtos com o novo valor agrupado.

   3.4 - No fechamento do mês atual o sistema tenta automaticamente recuperar os valores das ações e recalcular os valores agrupados. Se não conseguir, mostrar alerta da falha, dar a opção de continuar com os valores atuais ou cancelar. Em meses que não o atual, o sistema não atualiza os valores das ações; se o usuário desejar, poderá alterar manualmente o valor total agrupado.

4. Ao clicar em "Ações Clear", não vai abrir popup igual aos demais produtos — vai direcionar para /acoes, com o filtro em Clear e Ações.

5. Em /acoes vamos ter dois filtros: por instituição e por classe de ativo (aqui mostrando apenas as classes com flag isAcao).

6. Para isso vamos ter uma flag isAcao em Ações e FIIs que nos permita criar essas situações especiais. Isso não será editado pelo usuário, será predefinido no sistema.

7. Esses itens especiais de classe de ativos não poderão ser removidos nas suas respectivas áreas (tabelas de referência/auxiliares).

8. Produtos podem ser removidos dos meses em aberto. Temos que criar um botão para remover. Se um produto agregado ("Ações Clear") for removido, apenas o produto é removido, as ações permanecem na área de ações. Quando o sistema atualizar as ações, um novo item de produto "Ações Clear" é criado.

9. A alteração do produto "Ações Clear" será possível. Ao clicar no botão de editar, o usuário poderá alterar qualquer coisa — este é um produto qualquer. Quando houver um fechamento ou um comando para atualizar as ações em produtos, se não houver mais o produto "Ações Clear", o sistema vai criar um novo.
   [+] Recomendado: exibir um aviso sutil no form de edição de "Ações Clear" informando que os valores são gerenciados automaticamente e podem ser sobrescritos pela próxima atualização.

---

## Cadastro de Produtos

- O cadastro de produtos começará com os campos Categoria e Subcategoria (classe de ativo). Se for escolhida subcategoria que contenha o flag isAcao (ver "## Classe de Ativos"), um alerta será mostrado orientando o usuário a fazer o cadastro na área Ações/FIIs.
- [+] CNPJ é um campo exclusivo de produtos normais. Não aparece no formulário de ações nem de FIIs.
- Criar busca por nome do produto, mesma linha dos filtros.

---

## Fechamento/abertura de mês

Um mês pode estar em dois estados: aberto ou fechado.

Mês aberto: permite todas as operações normais — incluir, editar e remover produtos, alterar valores e registrar dividendos.

Mês fechado: bloqueia qualquer edição. Nenhum produto pode ser incluído, modificado ou ter dividendos cadastrados.

Um botão de alternância permite mudar o estado do mês. Ao acioná-lo, o sistema solicita confirmação antes de aplicar a mudança — tanto para fechar quanto para reabrir.

Ao tentar editar, incluir um produto ou cadastrar dividendos em um mês fechado, o sistema exibe um alerta informando que o mês está fechado e pergunta se o usuário deseja reabri-lo para edição.

Se for o mês corrente, o fechamento sempre vai tentar atualizar as ações. Se não for o mês corrente, nunca vai tentar atualizar as ações.

---

## Classe de Ativos

- Teremos duas classes de ativos especiais: Ações e FIIs (Fundos Imobiliários). Elas terão uma flag isAcao que, quando verdadeira, terão comportamentos diferentes em relação às demais classes de ativos. Serão consideradas como Classes de Ativos de sistema e por isso não poderão ser removidas na área Classe de Ativos.

---

## Ações

Ações não são registradas mês a mês — há um único conjunto de ações que se perpetua. A área /acoes exibe sempre a carteira atual do usuário.
[+] Não há seletor de mês em /acoes. O histórico dos valores mês a mês fica registrado exclusivamente nos produtos agregados ("Ações Clear") em /produtos.

- Os campos de ação são: Ticker, Quantidade, Preço médio de compra.
- Criar filtro de instituição e classe de ativo (que vai mostrar apenas as classes com flag isAcao).
- [+] Estado inicial vazio: quando o usuário não tem nenhuma ação cadastrada, exibir mensagem orientando com botão "Adicionar primeira ação".

---

## Copiar do mês anterior

A função "copiar do mês anterior" só permite copiar do mês se ele estiver fechado. Ao tentar copiar de um mês aberto, o sistema abre janela informando que o mês ainda se encontra em aberto e pergunta se deseja fechá-lo. Se clicar em "deseja fechar", ele fecha o mês anterior e copia os produtos para o mês atual.

Os campos aporte e retirada não são copiados para o mês seguinte, porque são eventos pontuais do mês em questão.

O mecanismo de verificação que testa se o mês atual tem produtos permanece.

[+] Ações individuais não são copiadas — elas já existem na carteira atual e não são mês a mês. O produto agregado ("Ações Clear") é copiado com os valores do mês fechado e será sobrescrito na próxima atualização das cotações.

---

## Notificações (sininho)

[+] Os pontos 3.1 e 3.2 dependem de um sistema de notificações (sininho). Este sistema será planejado no decorrer do desenvolvimento.

---

## Dúvidas

1. **Atualização de produtos ao adicionar/remover uma ação manualmente em /acoes**: Pela regra atual (3.3), o produto agregado "Ações Clear" só é recalculado após uma atualização bem-sucedida do Yahoo Finance. Se o usuário adicionar ou remover uma ação em /acoes fora de um ciclo de atualização, o valor em /produtos ficará desatualizado até a próxima atualização. Isso é aceitável, ou ao salvar uma ação o sistema deve recalcular o agregado imediatamente (usando o preço atual já em cache, sem consultar o Yahoo Finance novamente)?
R.: Recalcular o agregado novamente ao editar, incluir ou remover uma ação. usando o valor atual já em cache sem consulta ao yahoo finance.



=====================================================================================================


# TODO.NEWPRODUTOS.md

## Conceito sobre produtos e integração com ações

1- Produtos são exibidos por mes, todo mes temos um retrato (snapshot) dos valores daquele mes. Ao acessar um mês no passado, nenhum valor é recalculado, o que passou fica como histórico. (Ver fechamento/abertura de mes)
2- Ao resgatar os produtos da base de dados do mes corrente, que ainda está aberto, o sistema vai identificar as ações e fiis e criar registros em produtos dessa forma: Icone da instituição, Nome do Produto, rent. média, aporte, retirada, ganhos, dólar e total. Da mesma forma como em produtos normais. Esses dados vem da base de dados produtos.
2.1- O nome do produto será formado por Classe do ativo + Instituição. Ex. Ações Clear, Fiis Itau. O valor total desse produto será a soma do valor total de cada ações/fiis agrupadas por instituição.
2.2- Os valores de rent. média e ganhos são calculados comparando com o mesmo produto do mes anterior, se não existir mes anterior, o valor deve ser um "-".
2.3- Aporte e retirada - aqui entra valor manual, não busca nada em ações.
2.4- O valor total de "Ações Clear" será o que está no banco de dados de produtos.
2.5- O valor em dólar é apenas o valor total do produto convertido em dólar através da cotação daquele mes (ainda vamos definir a cotação)

3- Atualização dos valores das ações:
3.1- O preço atual das ações será atualizado sempre que o usuário entrar no site pela primeira vez naquele dia em background. Caso não consiga recuperar o valor das ações/fiis do yahoo finance, o sistema registra uma mensagem de alerta (sininho fica em vermelho com o número 1 ou mensagem +1). Se conseguir atualizar atualiza os valores agrupados em produtos.
3.2- O valor das ações também será atualizado quando o usuário explicitamente atualizar as cotações na área de Ações (vamos criar esta funcionalidade). Neste caso abre um popup com andamento da solicitação, barra de progresso e botão para executar em background ou cancelar. Emite mensagem no sininho.
3.3- Assim que as ações forem atualizadas com sucesso através do yahoo finance, o sistema vai recalcular o valor total por instituição e atualizar a tabela de produtos com o novo valor agrupado.
3.4- No fechamento do mês atual o sistema tenta automaticamente recuperar os valores das ações e recalcular os valores agrupados. Se não conseguir, mostrar alerta da falha, dar a opção de continuar com os valores atuais ou cancelar. Em meses que não o atual, o sistema não atualiza os valores das ações, se o usuário desejar poderá alterar manualmente o valor total agrupado.
4- Ao clicar em ações clear, não vai abri popup igual aos demais produtos, vai direcionar pra ações, com o filtro em clear e ações.
5- Em ações vamos ter dois filtros, por instituição e por classes de ativos(aqui só mostrando ações e fiis)
6- Pra isso vamos ter que ter um flag(isAção) acao / fiis que nos permita criar essas situações especiais. Isso não será editado pelo usuário, será prédefinido no sistema.
7- Esses itens especiais de classe de ativos não poderão ser removidos das suas respectivas áreas (tabelas de referencia/auxiliares)
8- Produtos podem ser removidos dos meses em aberto, temos que criar um botão para remover. Se um produto agregado ("Ações Clear") for removido, apenas o produto é removido, as ações permanecem da área de ações. Quando o sistema atualizar as ações, um novo item de produto "Ações Clear" é criado.

- [ ] O cadastro de produtos começará com os campos Categoria e Subcategoria(classe de ativo) Se for escolhido subcategoria que contenha o flag de isAção (Ver item "## Classe de Ativos"), um alerta será mostrado orientando o usuário a fazer o cadastro na área Ações / Fiis.

- [ ] A alteração do produto "Ações clear" será possível, ao clicar no botão de editar ele poderá alterar qualquer coisa, isto é um produto qualquer. Quando houver um fechamento, ou um comando para atualizar as ações em produtos, se não houver mais o produtos "Ações Clear" o sistema vai criar um.

- [ ] Teremos o conceito de Fechamento/abertura de mes. Apenas o mes corrente atualiza as ações ao fechar, meses anteriores que possar ser abertos e fechados não atualizam as ações automaticamente, mas podem ser alterados manualmente.
- [ ] Criar busca por nome do produto, mesma linha dos filtros.

## Fechamento/abertura de mes

Um mês pode estar em dois estados: aberto ou fechado.
Mês aberto: permite todas as operações normais — incluir, editar e remover produtos, alterar valores e registrar dividendos.
Mês fechado: bloqueia qualquer edição. Nenhum produto pode ser incluído, modificado ou ter dividendos cadastrados.
Um botão de alternância permite mudar o estado do mês. Ao acioná-lo, o sistema solicita confirmação antes de aplicar a mudança — tanto para fechar quanto para reabrir.
Ao tentar editar, incluir um produto ou cadastrar dividendos em um mês fechado, o sistema exibe um alerta informando que o mês está fechado e pergunta se o usuário deseja reabri-lo para edição.
Se for o mes corrente sempre vai tentar atualizar as ações e se não for o mes corrente nunca vai tentar atualizar as ações.

## Classe de Ativos

- [ ] Termos duas classes de ativos especiais: Ações e Fiis (fundos imobiliários) eles terão uma flag isAcao que quando verdadeira terão comportamentos diferentes em relação as demais classes de ativos. Serão considerados como Classe de Ativos de sistema e por isso não poderão ser removidos na área Classe de ativos.

## Ações
Ações não são registradas mes a mes, a um único conjunto de ações que se perpetua.
- [ ] Os campos de ação são: Ticker, Quantidade, Preço médio de compra.
- [ ] Criar filtro de instituição e classe de ativo (que vai mostrar apenas os flags isAcao).

## Copiar do mês anterior

A função "copiar do mês anterior" só permite copiar do mes se ele estiver fechado, ao tentar copiar de um mes aberto, sistema abre janela informando que o mes ainda se encontra em aberto e pergunta se deseja fechar o mes, se clicar em deseja fechar, ele fecha o mes anterior e copia os produtos pro mes atual. 
Os campos aporte e retirada não são copiados para o mes seguinte, porque são eventos pontuais do mês em questão.
O mecanismo de verificação que testa se o mes atual tem produtos permanece.



===================================================================

# TOTO.PRODUTOS.MD

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