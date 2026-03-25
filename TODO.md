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

---

## Geral

- [ ] Gerar favicon

## Dashboard

- [ ] Criar novo item de menu chamado dividendos

## Produtos

- [ ] Criar busca por nome do produto, mesma linha dos filtros.

---

## Copiar do mês anterior

---

## Classe de Ativos

---

## Ações

- [ ] Estado inicial vazio: quando o usuário não tem nenhuma ação cadastrada, exibir mensagem orientando com botão "Adicionar primeira ação".
- [ ] Em ações criar um gráfico de evolução da ação apenas com dados do yahoo finance. (pensar depois como algum dado nosso da ação pode ser útil pra interferir no gráfico, como data ou qtd)

---

## Dividendos

- [ ] Criar uma área para acompanhar dividendos, seja de ações, fundos ou fiis.
      Esta área vai mostrar o consolidado recebido de dividendos mês a mês, últimos 12 meses do ano selecionado. Se ano atual, mostra os últimos 12 meses; se ano antigo, mostra os 12 meses do ano. A tela segue o mesmo estilo da área consolidado mensal. Filtros somente de instituições, não tem categorias. Nas colunas vai ter o mês/ano, percentual de evolução comparado com o valor total do mês anterior (se não tiver nada no mês anterior, mostra um tracinho) e o valor total do dividendo. Ao clicar na linha (toda a linha é clicável) abre popup mostrando todos os produtos que geraram dividendos naquele mês, com ordem de maior dividendo pro menor, agrupado por instituição. Nessa lista mostra o ativo, a instituição e o valor do dividendo (dividendo total = dividendo + jcp + outros). Tem um botão de fechar o popup ou ao clicar fora ele volta pra lista.
- [ ] Pensar em como a integração produtos / ações / fiis vai impactar esta área. Produtos são mês a mês, ações é só atual.

---

## Mock

- [ ] Ajustar o mock para que na criação dos produtos ele não crie produtos agregados como produtos normais.

---

## Benchmark

---

## Mock inicial - fase de teste

- Ao criar um novo usuário os mocks devem gerar informação de produtos de abril/2024 até o mês/ano atual. Cada mês, iniciando em abril/2024 deve ser a evolução do anterior, com mais produtos e valores mais altos, até um total no mês/ano atual de 1 milhão de reais e 25 produtos.
- O mock de categorias, instituições e classes de ativos e liquidez deve buscar as mais usadas no mercado financeiro.

---

# FASE 2

## Admin

- Criar área de administração com ajustes como categorias/instituições/classe de ativos fixas, cores, temas etc.

---

# FASE BACKEND

## Seed do prisma - fase de produção

- Ao criar um novo usuário deve-se popular o mês corrente com 2 produtos de exemplo, deve popular as tabelas de categorias, classes de ativos, instituições, regiões, liquidez e cotação conforme regra de seed de primeiro cadastro

### Regra de seed de primeiro cadastro

---

# CONCLUÍDOS - [x]

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

- [+] Classe de Ativos — Implementar o conceito de ativo/inativo para classes de ativos e categorias. Uma classe ou categoria inativa não aparece nos formulários de cadastro/edição de produtos, mas continua associada aos produtos existentes sem quebrar histórico. Isso substitui a necessidade de remover registros em uso.
- [+] Copiar do mês anterior — Ações individuais não são copiadas: elas já existem na carteira atual e não são mês a mês. O produto agregado ("Ações Clear") é copiado com os valores do mês e será sobrescrito na próxima atualização das cotações.

---

# NÃO IMPLEMENTADOS - [-]

- [-] Fechamento/abertura de mês — Um mês poderia estar em dois estados: aberto ou fechado. Mês fechado bloquearia qualquer edição. Um botão de alternância permitiria mudar o estado com confirmação. Substituído por regras de aviso baseadas em data e danger zone para edições em meses passados.
- [-] Produtos — Ao fechar o mês atual, o sistema tentaria automaticamente recuperar os valores das ações e recalcular os valores agrupados. Substituído pela recuperação automática diária ao entrar no site.
