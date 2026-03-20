# Em Andamento

- [ ] faça o item dashboard

# FASE FRONTEND

## Geral

- [ ] Gerar favicon

## Dashboard

- [ ] criar novo item de menu chamado dividendos, esta área vai mostrar o consolidado recebido de dividendos mes a mes, últimos 12 meses do ano selecionado. Se ano atual, mostra os ultimos 12 meses, se ano antigo, mostra os 12 meses do ano. A tela segue o mesmo estilo da área consolidado mensal. Filtros somente de instituições, não tem categorias. Nas colunas vai ter o mes/ano, percentual de evolução comparado com o valor total do mes anterior, se não tem nada no mes anterior, mostra um tracinho, e o valor total do dividendo, ao clicar nesse linha (toda a linha é clicável) abre popup mostrando todos os produtos que geraram dividendos naquele mes, com ordem de maior dividendo pro menor, agrupado por instituição. Nessa lista mostra o ativo, qual instituição e valor do dividendo (dividendo total = dividendo + jcp + outros). Tem um botão de fechar o popup ou ao clicar fora ele volta pra lista.

## Produtos

- [ ] Conceito de ações nos produtos:
      1- Ações serão tratadas como produtos individuais, cada ação é um produto.
      2- -[ ] O cadastro de produtos começará com os campos Categoria e Subcategoria(classe de ativo) Se for escolhido subcategoria que contenha o flag de isAção, mudar o formulário para mostrar apenas os campos de ação, Ticker (nome do produto), quantidade, valor médio de compra. Esses novos campos vão existir em todos os produtos, fazem parte da entidade produto, mas apenas ações e fiis terão essas informações preenchidas. Caso seja escolhida outra classe de ativo, sem o flag de isAcao, o formulário é mostrado como é hoje.
- [ ] A área de ações permanece a mesma, mas terá um filtro de instituição e classe de ativo (que vai mostrar apenas os flags isAcao). Ao alterar uma ação nesta área, na verdade estaremos fazendo alteração na tabela de produtos. Dessa forma produtos sempre vai estar atualizada com os ultimos valores das ações.
- [ ] Teremos o conceito de Fechamento/abertura de mes. Apenas o mes corrente atualiza as ações ao fechar, meses anteriores que possar ser abertos e fechados não atualizam as ações automaticamente, mas podem ser alterados manualmente(qtd, valor medio de compra e ticker - nome do produto). Atualizar ações ao fechar é calcular o valor total da ação com base na sua quantidade e no ultimo valor do ticket no yahoo finance, esse valor é gravado no valor total da ação.

## Fechamento/abertura de mes

Um mês pode estar em dois estados: aberto ou fechado.
Mês aberto: permite todas as operações normais — incluir, editar e remover produtos, alterar valores e registrar dividendos.
Mês fechado: bloqueia qualquer edição. Nenhum produto pode ser incluído, modificado ou ter dividendos cadastrados.
Um botão de alternância permite mudar o estado do mês. Ao acioná-lo, o sistema solicita confirmação antes de aplicar a mudança — tanto para fechar quanto para reabrir.
Ao tentar editar, incluir um produto ou cadastrar dividendos em um mês fechado, o sistema exibe um alerta informando que o mês está fechado e pergunta se o usuário deseja reabri-lo para edição.

Ao acionar o fechamento, o dialog de confirmação exibe a opção "Atualizar Ações e FIIs" como um checkmark. O usuário marca ou desmarca conforme desejado e clica em confirmar. Uma segunda tela resume o impacto da escolha — informando se Ações e FIIs serão ou não computados no consolidado geral. Se confirmar, o sistema processa de acordo. Se cancelar, retorna ao dialog anterior para que ele revise a seleção.

Desabilitar a opção "Atualizar Ações e FIIs" para meses que não sejam o mês atual — a opção simplesmente não aparece ao fechar um mês passado, neste caso fecha o mes, sem atualizar as ações.

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
