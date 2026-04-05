# PRODUTOS

## Visão Geral

A área de Produtos é o núcleo do sistema. Ela apresenta os produtos financeiros do usuário e seus respectivos lançamentos mensais.

Os produtos são exibidos por mês, seguindo o conceito de snapshot mensal:
O comportamento dos produtos é compartilhado entre os meses, então mudanças de cadastro refletem em todo o histórico:

- Nome
- CNPJ
- Categoria
- Subcategoria (Classe de Ativo)
- Instituição
- Região
- Liquidez
- Detalhes/Observações

Enquanto os valores financeiros ficam congelados em cada mês:

- Valor BRL
- Valor USD
- Aporte
- Retirada

Campos que nunca são alterados pelo usuário (calculados pela API):

- Rentabilidade % (returnPct)
- Renda (income)
- Valor Final (valueFinal)
- Câmbio (exchangeRate)

- Cada mês representa um retrato dos valores naquele momento.
- Ao acessar meses passados, **nenhum valor é recalculado**.
- Os dados históricos permanecem exatamente como foram registrados.

A lista de produtos é mostrada com as seguintes informações:

- Ícone da instituição
- Nome do produto
- Rentabilidade média
- Aporte
- Retirada
- Ganhos
- Valor em dólar
- Total

### Regras de cálculo exibidas na listagem

- **Rentabilidade média** e **ganhos** são calculados comparando o produto com o **mesmo produto no mês anterior**.
- Caso não exista registro no mês anterior, o valor exibido deve ser **“-”**.
- **Aporte** e **retirada** são informados manualmente pelo usuário e **não são calculados** pelo sistema.
- **Valor em dólar** corresponde ao **valor total do produto convertido em USD** usando a cotação cadastrada para aquele mês.

## Tipos de Produto

- **Produtos Normais**
- **Produtos Agregados**

## Produtos Normais

Produtos normais representam **uma única aplicação financeira individual**.
Exemplos:

- CDB
- Fundo de investimento
- ETF individual
- Conta remunerada

Cada produto possui:

- Nome
- Categoria
- Subcategoria
- Instituição
- Região
- Liquidez
- CNPJ
- Detalhes
- Aporte
- Retirada
- Rentabilidade
- Valor final
- Conversão em BRL e USD

## Produtos Agregados:

Produtos agregados representam **um agrupamento automático de ativos**.
Eles consolidam ativos da área de **Ações**, agrupando-os por:

- **Ações/FIIs**
- **Instituição**

  ### Formação do nome

  O nome do produto agregado é formado por:
  - Classe do ativo + Instituição
    Exemplos:
    - Ações Clear
    - FIIs Itaú

  O valor total do produto agregado é:
  - Soma do valor total de todas as ações ou FIIs da mesma instituição

  ### Atualização dos Produtos Agregados

  Os dados dos produtos agregados são atualizados automaticamente pelas ações/fiis que as compõem. Em três situações:
  1. Primeiro acesso do usuário no dia
     Executado **em background**
  2. Quando acessa a área de ações após 15 minutos da última atualização.
     Executado **em background**
  3. Clique manual no botão "Atualizar Ações"
     Executado com **temporizador visível**

  ### Recuperação de dados de mercado

  O sistema tenta recuperar os preços das ações e FIIs via **Yahoo Finance**.

  Se a recuperação falhar:
  - O sistema registra um **alerta**
  - O ícone de notificações (**sininho**) fica **vermelho**
  - É exibido um contador com número de alertas
    **Ver a área de Sininho**

  Se a recuperação for bem-sucedida:
  - Os valores individuais das ações são atualizados
  - Após a atualização, o sistema recalcula automaticamente os **produtos agregados**

  - Sempre que a funcionalidade de recuperar as ações/Fiis é finalizada os valores dos produtos agregados são atualizados com o novo valor calculado.

## Encerramento de Produtos

1. Produtos Normais

   Produtos normais podem ser **encerrados manualmente**.

   Regras:
   - Um produto encerrado **não é considerado no mês atual e nos seguintes**
   - O histórico permanece intacto nos meses anteriores

   **Reativação**
   Produtos encerrados podem ser listados via filtro e reativados.

   Regra:
   - A reativação **só é permitida no mesmo mês em que o produto foi encerrado**

2. Produtos Agregados:

   Produtos agregados **não podem ser encerrados ou reativados pela área de produtos**.

   Para encerrar um produto agregado:
   - O usuário deve **remover todas as ações ou FIIs daquela instituição** na área de **Ações**

   Quando isso ocorre:
   - O produto agregado deixa de existir automaticamente, passa a ser um produto encerrado.

   Para reativar:
   - Basta **incluir novamente ações ou FIIs daquela instituição**, passa a ser novamente um produto ativo.

   É possível editar o valor total e o em dólar em produtos agregados anteriores ao mes atual.

## Edição de produtos

### Produtos Normais

Cada produto possui:

- Nome
- Categoria
- Subcategoria
- Instituição
- Região
- Liquidez
- CNPJ
- Detalhes
- Aporte
- Retirada
- Rentabilidade
- Valor final
- Conversão em BRL e USD

### Produtos Agregados

Produtos agregados podem ser editados **com restrições**.

Campos bloqueados
Os seguintes campos são sobrescritos pela agregação e **não podem ser editados**:

- Nome
- Categoria
- Classe de Ativos
- Instituição
- Total BRL
- Total USD

Os seguintes campos permanecem editáveis:

- Aporte
- Retirada
- Região
- Liquidez
- CNPJ
- Detalhes

## Controle de Meses e Anos

O sistema funciona de forma **contínua ao longo do tempo**, habilitando meses gradualmente.

### Regra geral para cadastro/edição de produtos nos meses e anos disponíveis

1. Meses
   O usuário pode cadastrar/editar:
   **Mês atual**
   **Mês seguinte**

   Exemplo:
   Se estamos em **março**:
   - Março → editável
   - Abril → editável
   - Maio → inacessível

   Quando chegar **1º de abril** Maio passa a ser habilitado.

2. Anos
   Exemplo:
   Em **dezembro de 2026**:
   - O ano **2027** já aparece na lista
   - Apenas **janeiro** fica clicável

   Quando chega **1º de janeiro**:
   - **fevereiro** é habilitado
   - e assim sucessivamente.

### Criação inicial da linha do tempo

A linha do tempo de anos e meses é definida pela **data mais antiga existente nos produtos do usuário**.

Exemplo:
Se o produto mais antigo é **abril/2022**:

- O sistema cria a sequência:
  abril/2022 → ... → mês atual

- A lista de anos inclui todos os anos entre o primeiro registro e o ano atual
- Cada ano possui seus 12 meses
- Exceções:
  - O **primeiro ano** começa no mês inicial existente
  - O **último ano** termina no mês atual

- Caso o usuário não tenha importado dados históricos:
- O produto só pode ser criado **em um mês/ano disponível**
- Não é permitido criar produtos **antes da linha do tempo existente**

* Pensar em como criar ano/meses sem ser pela importação - produto é incluído no mes/ano disponível, se não tem mes e ano disponível o produto antigo não pode ser incluído.

---

## Copiar do mês anterior

1. Conceito
   O sistema não avança os meses automaticamente. Cada mês é uma fotografia independente do patrimônio do usuário. O copiar do mes anterior ajuda o usuário a não precisar cadastrar todos os produtos novamente.

   O **botão "Copiar do mês anterior"** só é exibido quando o mês anterior possui algum produto ativo, seja normal ou agregado.

   São copiados todos os produtos do mês anterior que estejam ativos (isClosed = false). Produtos encerrados são ignorados. Produtos agregados (Ações/FIIs) são incluídos na cópia como qualquer outro produto.

2. O que acontece ao confirmar
   1. Todas as entries do mês destino são deletadas — ativas e encerradas
   2. Para cada produto ativo do mês anterior é criada uma nova entry independente no mês destino via POST /api/entries, com:
   - Valores patrimoniais (valueBrl, valueUsd, valueOriginal) herdados do mês anterior
   - contribution, withdrawal e returnPct zerados (eventos pontuais do mês)
   3. O sistema recalcula os produtos agregados (Ações/FIIs) via upsertAggregatedProducts, atualizando as entries correspondentes com os valores correntes das ações
   4. Produtos e entries são recarregados da API — a tela é atualizada uma única vez ao final, evitando flickers intermediários

3. Isolamento entre meses
   Cada entry criada recebe um novo ID gerado pelo backend. Editar os valores financeiros de um produto no mês atual não afeta o mês anterior, pois são registros completamente independentes.

   O produto em si (nome, categoria, instituição, liquidez) é compartilhado entre os meses — alterações nesses campos refletem em todo o histórico, permitindo acompanhar a evolução do mesmo produto ao longo do tempo. Apenas os valores financeiros (patrimônio, aporte, retirada) são isolados por entry mensal.

4. Modal de confirmação
   - Se o mês destino não tem produtos ativos: exibe modo simples com contagem e confirmação direta
   - Se o mês destino já tem produtos ativos: exibe aviso de substituição irreversível com checkbox de confirmação obrigatório
   - Produtos encerrados no mês destino não contam para o aviso de substituição
   - A contagem exibida no modal e no banner considera apenas produtos ativos e não-encerrados do mês anterior
   - Se o mês de origem ainda não chegou ao fim (menos de 3 dias para o próximo mês), exibe aviso de dados incompletos

# AÇÕES

- Ações não são registradas mês a mês — há um único conjunto de ações que se perpetua. A área /acoes exibe sempre a carteira atual do usuário.
- Os campos de ação são: Ticker, Quantidade, Preço médio de compra.
- Será possível dar refresh que irá atualizar os dados das ações com os valores mais recentes do yahoo finance. Depois de atualizar as ações, o sistema vai agrupar as ações por instituição e gravar como produtos agregados do mes atual o valor final ("Ações Clear")
- Ao editar, incluir ou remover uma ação o sistema deve recalcular o agregado imediatamente (usando o preço atual já em cache, sem consultar o Yahoo Finance novamente) e atualizar o agregado em produtos. Se todas as ações de um produto agregado forem removidas o produto deve ser encerrado (não deletado).

---

# CLASSE DE ATIVOS

- Existem duas classes de ativos especiais: Ações e FIIs (Fundos Imobiliários). Elas terão uma flag isAcao que, quando verdadeira, o sistema terá comportamentos diferentes em relação às demais classes de ativos. Serão consideradas como Classes de Ativos de sistema e por isso não poderão ser removidas na área Classe de Ativos.

# SININHO

- Haverá eventos no site que precisarão reportar uma falha em background ou sucesso, ou ainda mensagens que o usuário precisa de atenção.
- Teremos em cada mensagem data, hora e um texto curto sinalizando o problema.
- Quando o sitema incluir uma nova mensagem o sininho deve ficar em vermelho com um número de mensagens em branco/preto (dependendo do tema).
- Quando o usuário clicar no sininho abre um popup mostrando todas as mensagens novas
- Mensagens com mais de 48h são setadas como antigas e não são mais mostradas no sininho.

# DIVIDENDOS

- Dividendos são incluídos nos produtos e nas ações / fiis pelo usuário.
- Os dividendos serão acompanhados por uma área específica. Serão mostrados dividendos de produtos, produtos agregados(ações e fiis serão mostrados no detalhamento).
- Mostrar o consolidado recebido de dividendos mês a mês, últimos 12 meses do ano selecionado. Se ano atual, mostra os últimos 12 meses; se ano antigo, mostra os 12 meses do ano. A tela segue o mesmo estilo da área consolidado mensal.
- Filtros por instituições.
- Nas colunas vai ter o mês/ano, percentual de evolução comparado com o valor total do mês anterior (se não tiver nada no mês anterior, mostra um tracinho) e o valor total do dividendo.

- Produtos Agregados
  - Ao fazer o agregado de ações virar um produto o sistema deve contabilizar os dividendos das ações/fiis e colocar no produto. Por exemplo se itub4 e petr4, que são ações da instituição Clear, receberem dividendos, quando o sistema atualizar os produtos agregados, o dividendos recebidos por essas ações, no mês em questão, serão somados ao produto agregado.
  - Ao clicar na linha de dividendos (toda a linha é clicável) abre popup mostrando todos os produtos que geraram dividendos naquele mês, com ordem de maior dividendo pro menor, agrupado por instituição. Nessa lista mostra a instituição, o ativo e o valor do dividendo (dividendo total = dividendo + jcp + outros). Tem um botão de fechar o popup ou ao clicar fora ele volta pra lista.
    - Na lista de produtos desse popup se houver algum produto agregado, ao ser clicado mostra outro popup com a lista de ações/ou fiis que formam o produto agregado mostrando as ações/fiis que tiveram dividendos, ordenado do maior pro menor.]
