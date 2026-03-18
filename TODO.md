# FASE FRONTEND

## No sistema inteiro
- [x] Trocar texto editar e excluir por icones padrão do sistema.
- Gerar favicon


## Dashboard
   ### Consolidado mensal
   - [ ] tem que mostrar na lista o mais recente primeiro e o mais antigo por último.
   - [ ] no filtro de instituições manter sempre um selecionado não foi uma boa ideia, permita que ao clicar em todos, marque todos, clicando novamente, desmarca todos. ao desmarcar todos a lista fica zerada. Fazer a mesma coisa pro filtro de categorias.


## Produtos
   - [ ] ver alguma forma de transpor as ações para produtos no final do mes. Talvez criar a ideia de trancar/destrancar mes, e impedir mudanças nos dados de produtos daquele mes. Ao trancar o mes importo as ações. Ter um botão pra importar as ações sempre que eu desejar.


## Ações
   - [ ] excluir e editar ainda estão como texto, mudar pra ícone padrão.
   - [ ] criar área de dividendos, nos mesmos moldes e conceitos de produtos
   - [ ] permitir a inclusão de fiis tb? não né. pq aí pra importar ia complicar, teria que distinguir o que é acção e o que é fiis.


## Dividendos
- [x] Em produtos ter um ícone ao lado do editar para registro de dividendos. Dividendos não entram no total do produto pois é um valor que cai na conta corrente, esses valores só serão mostrados em relatórios. Ao clicar no botão, abre popup com a possibilidade de colcoar dia(já vem pre-prenchido com o dia de hoje)(mes e ano já está informado pelos ano e mes selecionados)(o usuário vai informar só o dia, mas o sistema vai incluir a data toda, pra futuros relatórios), valor do dividendo, valor jcp, outros proventos. Usuário preenche os campos e salva, sistema mostra total, ele pode criar várias linhas de dividendos. A informação de total de dividendo é usada para calcular ganhos e rentabilidade. No detalhe do produto incluir a informação total de dividendos recebidos (vai ser o total de dividendos recebidos naquele mes.)
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