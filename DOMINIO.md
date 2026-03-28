# PRODUTOS

   ## Conceitos
   - Núcleo do sistema. Listagem de produtos ativos do usuário com acesso aos lançamentos mensais e dividendos.
   - Produtos são exibidos por mês. Todo mês temos um retrato (snapshot) dos valores daquele mês. Ao acessar um mês no passado, nenhum valor é recalculado, o que passou fica como histórico.
   - Ao recuperar os dados de produtos da base de dados do mês corrente, o sistema vai identificar os produtos existentes e apresentar dessa forma: ícone da instituição, Nome do Produto, rent. média, aporte, retirada, ganhos, dólar e total.       
   - Os valores de rent. média e ganhos são calculados comparando com o mesmo produto do mês anterior. Se não existir mês anterior, o valor deve ser um "-".
   - Aporte e retirada são preenchidos pelo usuário e não calculados
   - O valor em dólar é apenas o valor total do produto convertido em dólar através da cotação daquele mês.

   - **Tipos de produtos**
      - Existem dois tipos de composição de produtos, **produtos normais** e **agregados**. Produtos normais, são um único produto, um cdb, ou um fundo por exemplo. Um produto agregado é um conjunto de ações ou fundos imobiliários, agrupados como um único produto - produto agregado.

   ## Produtos Agregados:
   - O nome do produto agregado será formado por Classe do ativo + Instituição. Ex.: Ações Clear, FIIs Itaú. O valor total desse produto será a soma do valor total de cada ação/fii agrupados por instituição.

   - **Atualização de produtos agregados**:
      - Os dados dos produtos agregados é atualizado em 3 momentos:
         - Quando o usuário entra no site pela primeira vez no dia, em background;
         - Quando se passa 15 minutos da última atualização e ele entra na área ações, em background.
         - Quando ele clica explicitamente no botão de atualizar ações, com barra de progresso.
      - Caso não consiga recuperar o valor das ações/fiis do Yahoo Finance, o sistema registra uma mensagem de alerta (sininho fica em vermelho com o número 1 ou mensagem +1). Se conseguir, atualiza os valores individuais de cada ação. 
      - Sempre que a funcionalidade de recuperar as ações é finalizada os valores dos produtos agregados são atualizados com o novo valor calculado.

   ## Edição de produtos
   Um produto agregado pode ser alterado, mais com algumas restrições:
   -Os campos que a agregação sobrescreve e devem ficar bloqueados:
   - Nome, Categoria, Subcategoria, Instituição, Total BRL / Total USD
   - Os campos que ele não toca e podem ser editados livremente: Aporte / Retirada, região, Liquidez, CNPJ, Detalhes

   ## Encerramento de produtos
   - Produtos podem ser encerrados e não serão considerados para o próximo mês. Produtos agregados, como são montados de acordo com ações/fiis não podem ser encerrados, exceto se todas as ações/fiis daquela instituição forem removidas na área de ações.
   - Produtos encerrados em abril continuam estando ativos nos meses anteriores, só passam a ser considerados encerrados para os meses seguintes. 
   - É possível, através do filtro, listar os produtos encerrados e voltar a te-los ativos. A reativação só é possível no mês em que o produto foi encerrado.

   ## Meses dos produtos
   - O sistema é vivo, e o andamento dos anos e meses também. Ao iniciar sua conta sem importações por exemplo, se você começa em 2026 no mes de março, apenas maio e abril ficam disponíveis para editção, os demais meses ficam inativos. Com o passar do tempo, novos meses vão sendo habilitados. Exemplo: Se estamos em março, abril também fica habilitado para cadastro e edição, porém maio fica inacessível. Quando chegarmos em 1 de abrir, maio se torna disponível. 
   - então quando chegar em 2027, a combo de ano terá que ter esse ano disponível em Dezembro de 2026 só com janeiro clicável, os demais meses inativos. Em 1 de janeiro, fevereiro habilita e assim por diante.
   - A criação inicial de mes e ano segue a seguinte regra. O mes/ano inicial é a data mais antiga existente na lista de produtos do usuário. Se o produto mais antigo for abril/2022, a combo de anos e meses deve progredir mes a mes até o mes atual/ano atual. Então a combo de ano vai ter 2022, 2023... 2026 e cada ano com seus 12 meses, com exceção do primeiro e do ultimo mes. 
      - Pensar em como criar ano/meses sem ser pela importação - produto é incluído no mes/ano disponível, se não tem mes e ano disponível o produto antigo não pode ser incluído.


---


# AÇÕES
   - Ações não são registradas mês a mês — há um único conjunto de ações que se perpetua. A área /acoes exibe sempre a carteira atual do usuário.
   - Os campos de ação são: Ticker, Quantidade, Preço médio de compra.
   - Será possível dar refresh que irá atualizar os dados das ações com os valores mais recentes do yahoo finance. Depois de atualizar as ações, o sistema vai agrupar as ações por instituição e gravar como produtos agregados do mes atual o valor final ("Ações Clear")
   - Ao editar, incluir ou remover uma ação o sistema deve recalcular o agregado imediatamente (usando o preço atual já em cache, sem consultar o Yahoo Finance novamente) e atualizar o agregado em produtos.

---

# CLASSE DE ATIVOS
   - Existem  duas classes de ativos especiais: Ações e FIIs (Fundos Imobiliários). Elas terão uma flag isAcao que, quando verdadeira, o sistema terá comportamentos diferentes em relação às demais classes de ativos. Serão consideradas como Classes de Ativos de sistema e por isso não poderão ser removidas na área Classe de Ativos.


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
   - Nas colunas vai ter o mês/ano, percentual de evolução comparado com o valor total do mês anterior (se não tiver nada no mês anterior, mostra um tracinho) e  o valor total do dividendo.

   - Produtos Agregados
      - Ao fazer o agregado de ações virar um produto o sistema deve contabilizar  os dividendos das ações/fiis e colocar no produto. Por exemplo se itub4 e petr4, que são ações da instituição Clear, receberem dividendos, quando o sistema atualizar os produtos agregados, o dividendos recebidos por essas ações, no mês em questão, serão somados ao produto agregado.
      - Ao clicar na linha de dividendos (toda a linha é clicável) abre popup mostrando todos os produtos que geraram dividendos naquele mês, com ordem de maior dividendo pro menor, agrupado por instituição. Nessa lista mostra a instituição, o ativo e o valor do dividendo (dividendo total = dividendo + jcp + outros). Tem um botão de fechar o popup ou ao clicar fora ele volta pra lista. 
         - Na lista de produtos desse popup se houver algum produto agregado, ao ser clicado mostra outro popup com a lista de ações/ou fiis que formam o produto agregado mostrando as ações/fiis que tiveram dividendos, ordenado do maior pro menor.