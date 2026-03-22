# REGRAS -  todo.md para uso da IA.

  Fluxo principal:
  1. Ler o todo.md completo
  2. Identificar os itens do tópico "Em Andamento"
  3. Executar item por item
  4. Ao final de cada item, perguntar se pode prosseguir para o próximo
  5. À medida que conclui cada item, marcar com [x] no todo.md
  6. Ao finalizar todos os itens, perguntar se o usuário quer mover os concluídos para "Concluído"
  7. Ao mover, replicar o texto exato precedido de data e hora: - [x] 2026-03-22 14:30 — texto original da tarefa
  ---
  Regra especial — itens ponteiros:

  Se um item em "Em Andamento" aponta para outro (ex: "faça o item dashboard", "faça o primeiro item de Produtos"):
  - Executa o item apontado
  - Move o item apontado para Concluído (com data/hora + texto exato)
  - Apaga o ponteiro do "Em Andamento" — ele não vai para Concluído
  - O ponteiro é descartável após cumprir sua função


## Em Andamento
   

## Geral
   - [ ] Gerar favicon
   - [ ] Ao entrar no site pela primeira vez no dia o sistema vai tentar, em backgound, recuperar as ações e os valores de benchmark da internet. Caso haja problemas, será reportado na área de notificações.

## Dashboard
   - [ ] criar novo item de menu chamado dividendos 


## Produtos
   - [ ] Ao fechar o mês - No fechamento do mês atual o sistema tenta automaticamente recuperar os valores das ações e recalcular os valores agrupados. Se não conseguir, mostrar alerta da falha, dar a opção de continuar com os valores atuais ou cancelar. Em meses anteriores, que não o atual, o sistema não atualiza os valores das ações.

---

## Cadastro de Produtos
   - [ ] Criar busca por nome do produto, mesma linha dos filtros.

---

## Fechamento/abertura de mês
   - Um mês pode estar em dois estados: aberto ou fechado.
   - Mês aberto: permite todas as operações normais — incluir, editar e remover produtos, alterar valores e registrar dividendos.
   - Mês fechado: bloqueia qualquer edição. Nenhum produto pode ser incluído, modificado ou ter dividendos cadastrados.
   - Um botão de alternância permite mudar o estado do mês. Ao acioná-lo, o sistema solicita confirmação antes de aplicar a mudança — tanto para fechar quanto para reabrir.
   - Ao tentar editar, incluir um produto ou cadastrar dividendos em um mês fechado, o sistema exibe um alerta informando que o mês está fechado e pergunta se o usuário deseja reabri-lo para edição.
   - Se for o mês corrente, o fechamento sempre vai tentar atualizar as ações. Se não for o mês corrente, nunca vai tentar atualizar as ações.

---

## Classe de Ativos
   - [futuro] Implementar o conceito de ativo/inativo para classes de ativos e categorias. Uma classe ou categoria inativa não aparece nos formulários de cadastro/edição de produtos, mas continua associada aos produtos existentes sem quebrar histórico. Isso substitui a necessidade de remover registros em uso.


---

## Ações
   - [+] Estado inicial vazio: quando o usuário não tem nenhuma ação cadastrada, exibir mensagem orientando com botão "Adicionar primeira ação".
   - [ ] Em ações criar um gráfico de evolução da ação apenas com dados do yahoo finance. (pensar depois como algum dado nosso da ação pode ser util pra interferir no gráfico, como data, ou qtd)


---

## Copiar do mês anterior
   - A função "copiar do mês anterior" só permite copiar do mês se ele estiver fechado. Ao tentar copiar de um mês aberto, o sistema abre janela informando que o mês ainda se encontra em aberto e pergunta se deseja fechá-lo. Se clicar em "deseja fechar", ele fecha o mês anterior e copia os produtos para o mês atual.
   - Os campos aporte e retirada não são copiados para o mês seguinte, porque são eventos pontuais do mês em questão.
   - O mecanismo de verificação que testa se o mês atual tem produtos permanece.
   [+] Ações individuais não são copiadas — elas já existem na carteira atual e não são mês a mês. O produto agregado ("Ações Clear") é copiado com os valores do mês fechado e será sobrescrito na próxima atualização das cotações.

---

## Notificações (sininho)
   [+] Os pontos 3.1 e 3.2 dependem de um sistema de notificações (sininho). Este sistema será planejado no decorrer do desenvolvimento.

---


## Dividendos
   - [ ] Criar uma área para acompanhar dividendos, seja de ações, fundos ou fiis.
   esta área vai mostrar o consolidado recebido de dividendos mes a mes, últimos 12 meses do ano selecionado. Se ano atual, mostra os ultimos 12 meses, se ano antigo, mostra os 12 meses do ano. A tela segue o mesmo estilo da área consolidado mensal. Filtros somente de instituições, não tem categorias. Nas colunas vai ter o mes/ano, percentual de evolução comparado com o valor total do mes anterior, se não tem nada no mes anterior, mostra um tracinho, e o valor total do dividendo, ao clicar nesse linha (toda a linha é clicável) abre popup mostrando todos os produtos que geraram dividendos naquele mes, com ordem de maior dividendo pro menor, agrupado por instituição. Nessa lista mostra o ativo, qual instituição e valor do dividendo (dividendo total = dividendo + jcp + outros). Tem um botão de fechar o popup ou ao clicar fora ele volta pra lista.
   - [ ] Pensar em como a integração produtos / ações / fiis vai impactar esta área. Produtos são mes a mes, açoes é só atual.

--- 

## Mock
   - [ ] Ajustar o mock para que na criação dos produtos ele não crie produtos agregados como produtos normais.

---

## Benchmark

---

## Mock inicial - fase de teste
   - Ao criar um novo usuário os mocks devem gerar informação de produtos de abril/2024 até o mes/ano atual. Cada mês, inciando em abril/2024 deve ser a evolução do anterior, com mais produtos, e produtos com valor mais alto, até um total no mes/ano atual de 1 milhão de reais e 25 produtos.
   - O mock de categorias, instituições e classes de ativos e liquides deve buscar as mais usadas no mercado financeiro, as principais.

---

# FASE 2
   ## Admin
   - Criar área de administração com ajustes como categorias/instituições/classe de ativos fixas, cores, themas etc.

---


# FASE BACKEND
   ## Seed do prisma - fase de produção
      - Ao criar um novo usuário deve-se popular o mes corrente com 2 produtos de exemplo, deve popular as tabelas de categorias, classes de ativos, instituições, regiões, liquidez e cotação conforme regra de seed de primeiro cadastro
      ### Regra de seed de primeiro cadastro


---

# CONCLUÍDO

   - [x] 2026-03-22 — Criar duas classes de ativos especiais: Ações e FIIs (Fundos Imobiliários). Elas terão uma flag isAcao que, quando verdadeira, terão comportamentos diferentes em relação às demais classes de ativos. Serão consideradas como Classes de Ativos de sistema e por isso não poderão ser removidas na área Classe de Ativos.
   - [x] 2026-03-22 — Ao clicar em "Ações Clear", não vai abrir popup igual aos demais produtos — vai direcionar para /acoes, com o filtro em Clear e Ações.
   - [x] 2026-03-22 — Em /acoes vamos ter dois filtros: por instituição e por classe de ativo (aqui mostrando apenas as classes com flag isAcao).
   - [x] 2026-03-22 — Ter um botão em ações/fiis de refresh que irá atualizar os dados das ações com os valores mais recentes do yahoo finance. Depois de atualizar as ações, o sistema vai agrupar as ações por instituição e gravar em produtos do mes atual o valor final (Ações Clear)
   - [x] 2026-03-22 — Ao editar, incluir ou remover uma ação o sistema deve recalcular o agregado imediatamente (usando o preço atual já em cache, sem consultar o Yahoo Finance novamente) e atualizar o agregado em produtos.
   - [x] 2026-03-22 — Vamos também criar uma paginação, permitir que o usuário possa escolher a qtd de registros por página (10, 20, 50, 100) Esse valor é guardado nas configs do usuário e sempre que ele entrar o sistema saberá da sua preferencia.
   - [x] 2026-03-22 — Não há seletor de mês em /acoes. O histórico dos valores mês a mês fica registrado exclusivamente nos produtos agregados ("Ações Clear") em /produtos.
   - [x] 2026-03-22 — Os campos de ação são: Ticker, Quantidade, Preço médio de compra.
   - [x] 2026-03-22 — Criar filtro de instituição e classe de ativo (que vai mostrar apenas as classes com flag isAcao).
   - [x] 2026-03-22 — O cadastro de produtos começará com os campos Categoria e Subcategoria (classe de ativo). Se for escolhida subcategoria que contenha o flag isAcao (ver "## Classe de Ativos"), um alerta será mostrado orientando o usuário a fazer o cadastro na área Ações/FIIs.
   - [x] 2026-03-22 — Recomendado: exibir um aviso sutil no form de edição de "Ações Clear" informando que os valores são gerenciados automaticamente e podem ser sobrescritos pela próxima atualização.
   - [x] Trocar texto editar e excluir por icones padrão do sistema.
   - [x] tem que mostrar na lista o mais recente primeiro e o mais antigo por último.
   - [x] no filtro de instituições manter sempre um selecionado não foi uma boa ideia, permita que ao clicar em todos, marque todos, clicando novamente, desmarca todos. ao desmarcar todos a lista fica zerada. Fazer a mesma coisa pro filtro de categorias.
   - [x] permitir a inclusão de fiis tb? não né. pq aí pra importar ia complicar, teria que distinguir o que é acção e o que é fiis.
   - [x] Em produtos ter um ícone ao lado do editar para registro de dividendos. Dividendos não entram no total do produto pois é um valor que cai na conta corrente, esses valores só serão mostrados em relatórios. Ao clicar no botão, abre popup com a possibilidade de colcoar dia(já vem pre-prenchido com o dia de hoje)(mes e ano já está informado pelos ano e mes selecionados)(o usuário vai informar só o dia, mas o sistema vai incluir a data toda, pra futuros relatórios), valor do dividendo, valor jcp, outros proventos. Usuário preenche os campos e salva, sistema mostra total, ele pode criar várias linhas de dividendos. A informação de total de dividendo é usada para calcular ganhos e rentabilidade. No detalhe do produto incluir a informação total de dividendos recebidos (vai ser o total de dividendos recebidos naquele mes.)
   - [x] criar no area de ações funcionalidade de dividendos, nos mesmos moldes e conceitos da área de produtos
   - [x] o ano em produtos está escondido na linha dos meses, passe o ano pra cima da lista de meses, numa compo, será possível também selecionar o ano global por aqui.
