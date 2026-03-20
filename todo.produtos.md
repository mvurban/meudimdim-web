

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