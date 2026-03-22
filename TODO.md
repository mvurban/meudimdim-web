# Em Andamento

- [ ] faça o item dashboard

## Geral
- [ ] Gerar favicon

## Dashboard
- [ ] criar novo item de menu chamado dividendos 


## Produtos
1. Produtos são exibidos por mês. Todo mês temos um retrato (snapshot) dos valores daquele mês. Ao acessar um mês no passado, nenhum valor é recalculado, o que passou fica como histórico. (Ver Fechamento/abertura de mês)
2. Ao resgatar os produtos da base de dados do mês corrente, que ainda está aberto, o sistema vai identificar as ações e fiis e criar registros em produtos dessa forma: ícone da instituição, Nome do Produto, rent. média, aporte, retirada, ganhos, dólar e total. Da mesma forma como em produtos normais. Esses dados vem da base de dados produtos.
   2.1 - O nome do produto será formado por Classe do ativo + Instituição. Ex.: Ações Clear, FIIs Itaú. O valor total desse produto será a soma do valor total de cada ação/fii agrupados por instituição.
   2.2 - Os valores de rent. média e ganhos são calculados comparando com o mesmo produto do mês anterior. Se não existir mês anterior, o valor deve ser um "-".
   2.3 - Aporte e retirada — aqui entra valor manual, não busca nada em ações.
   2.4 - O valor total de "Ações Clear" será o que está no banco de dados de produtos.
   2.5 - O valor em dólar é apenas o valor total do produto convertido em dólar através da cotação daquele mês (ainda vamos definir a cotação).
   2.6 - O v
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
- Um mês pode estar em dois estados: aberto ou fechado.
- Mês aberto: permite todas as operações normais — incluir, editar e remover produtos, alterar valores e registrar dividendos.
- Mês fechado: bloqueia qualquer edição. Nenhum produto pode ser incluído, modificado ou ter dividendos cadastrados.
- Um botão de alternância permite mudar o estado do mês. Ao acioná-lo, o sistema solicita confirmação antes de aplicar a mudança — tanto para fechar quanto para reabrir.
- Ao tentar editar, incluir um produto ou cadastrar dividendos em um mês fechado, o sistema exibe um alerta informando que o mês está fechado e pergunta se o usuário deseja reabri-lo para edição.
- Se for o mês corrente, o fechamento sempre vai tentar atualizar as ações. Se não for o mês corrente, nunca vai tentar atualizar as ações.

---

## Classe de Ativos
- Teremos duas classes de ativos especiais: Ações e FIIs (Fundos Imobiliários). Elas terão uma flag isAcao que, quando verdadeira, terão comportamentos diferentes em relação às demais classes de ativos. Serão consideradas como Classes de Ativos de sistema e por isso não poderão ser removidas na área Classe de Ativos.
- [futuro] Implementar o conceito de ativo/inativo para classes de ativos e categorias. Uma classe ou categoria inativa não aparece nos formulários de cadastro/edição de produtos, mas continua associada aos produtos existentes sem quebrar histórico. Isso substitui a necessidade de remover registros em uso.


---

## Ações
Ações não são registradas mês a mês — há um único conjunto de ações que se perpetua. A área /acoes exibe sempre a carteira atual do usuário.
[+] Não há seletor de mês em /acoes. O histórico dos valores mês a mês fica registrado exclusivamente nos produtos agregados ("Ações Clear") em /produtos.
- Os campos de ação são: Ticker, Quantidade, Preço médio de compra.
- Criar filtro de instituição e classe de ativo (que vai mostrar apenas as classes com flag isAcao).
- [+] Estado inicial vazio: quando o usuário não tem nenhuma ação cadastrada, exibir mensagem orientando com botão "Adicionar primeira ação".
- [ ] Ter um botão em ações/fiis de refresh que irá atualizar os dados das ações com os valores mais recentes do yahoo finance. Depois de atualizar as ações, o sistema vai agrupar as ações por instituição e gravar em produtos do mes atual o valor final (Ações Clear)
- [ ] Ao editar, incluir ou remover uma ação o sistema deve recalcular o agregado imediatamente (usando o preço atual já em cache, sem consultar o Yahoo Finance novamente) e atualizar o agregado em produtos.
- [ ] Vamos também criar uma paginação, permitir que o usuário possa escolher a qtd de registros por       
  página (10, 20, 50, 100) Esse valor é guardado nas configs do usuário e sempre que ele entrar o sistema saberá da sua preferencia. 
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


## Benchmark


## Mock inicial - fase de teste
- Ao criar um novo usuário os mocks devem gerar informação de produtos de abril/2024 até o mes/ano atual. Cada mês, inciando em abril/2024 deve ser a evolução do anterior, com mais produtos, e produtos com valor mais alto, até um total no mes/ano atual de 1 milhão de reais e 25 produtos.
- O mock de categorias, instituições e classes de ativos e liquides deve buscar as mais usadas no mercado financeiro, as principais.


# FASE 2
## Admin
- Criar área de administração com ajustes como categorias/instituições/classe de ativos fixas, cores, themas etc.

---


# FASE BACKEND
## Seed do prisma - fase de produção
- Ao criar um novo usuário deve-se popular o mes corrente com 2 produtos de exemplo, deve popular as tabelas de categorias, classes de ativos, instituições, regiões, liquidez e cotação conforme regra de seed de primeiro cadastro
### Regra de seed de primeiro cadastro


---

# Concluído

- [x] Trocar texto editar e excluir por icones padrão do sistema.
- [x] tem que mostrar na lista o mais recente primeiro e o mais antigo por último.
- [x] no filtro de instituições manter sempre um selecionado não foi uma boa ideia, permita que ao clicar em todos, marque todos, clicando novamente, desmarca todos. ao desmarcar todos a lista fica zerada. Fazer a mesma coisa pro filtro de categorias.
- [x] permitir a inclusão de fiis tb? não né. pq aí pra importar ia complicar, teria que distinguir o que é acção e o que é fiis.
- [x] Em produtos ter um ícone ao lado do editar para registro de dividendos. Dividendos não entram no total do produto pois é um valor que cai na conta corrente, esses valores só serão mostrados em relatórios. Ao clicar no botão, abre popup com a possibilidade de colcoar dia(já vem pre-prenchido com o dia de hoje)(mes e ano já está informado pelos ano e mes selecionados)(o usuário vai informar só o dia, mas o sistema vai incluir a data toda, pra futuros relatórios), valor do dividendo, valor jcp, outros proventos. Usuário preenche os campos e salva, sistema mostra total, ele pode criar várias linhas de dividendos. A informação de total de dividendo é usada para calcular ganhos e rentabilidade. No detalhe do produto incluir a informação total de dividendos recebidos (vai ser o total de dividendos recebidos naquele mes.)
- [x] criar no area de ações funcionalidade de dividendos, nos mesmos moldes e conceitos da área de produtos
- [x] o ano em produtos está escondido na linha dos meses, passe o ano pra cima da lista de meses, numa compo, será possível também selecionar o ano global por aqui.
