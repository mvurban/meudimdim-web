# PRODUTOS

   ## Conceitos
      - Núcleo do sistema. Listagem de produtos ativos do usuário com acesso aos lançamentos mensais e dividendos.
      - Produtos são exibidos por mês. Todo mês temos um retrato (snapshot) dos valores daquele mês. Ao acessar um mês no passado, nenhum valor é recalculado, o que passou fica como histórico.
      - Existem dois tipos de composição de produtos, produtos normais e agregados. Produtos normais, são um único produto, um cdb, ou um fundo por exemplo. Um produto agregado é um conjunto de ações ou fundos imobiliários, agrupados como um único produto - produto agregado.
      - Ao resgatar os produtos da base de dados do mês corrente, o sistema vai identificar as ações e fiis e criar registros em produtos dessa forma: ícone da instituição, Nome do Produto, rent. média, aporte, retirada, ganhos, dólar e total. Tanto pra produtos normais quanto pra agregado.
      - O nome do produto agregado será formado por Classe do ativo + Instituição. Ex.: Ações Clear, FIIs Itaú. O valor total desse produto será a soma do valor total de cada ação/fii agrupados por instituição.
      - Os valores de rent. média e ganhos são calculados comparando com o mesmo produto do mês anterior. Se não existir mês anterior, o valor deve ser um "-".
      - Aporte e retirada — aqui entra valor manual, tanto pra produtos normais, quanto pra agregados.
      - O valor em dólar é apenas o valor total do produto convertido em dólar através da cotação daquele mês (ainda vamos definir a cotação).

   ## Edição de produtos
      Um produto agregado pode ser alterado, mais com algumas restrições:
      -Os campos que a agregação sobrescreve e devem ficar bloqueados:
      - Nome, Categoria, Subcategoria, Instituição, Total BRL / Total USD
      - Os campos que ele não toca e podem ser editados livremente: Aporte / Retirada, região, Liquidez, CNPJ, Detalhes


   ## Encerramento de produtos
   - Produtos podem ser encerrados e não serão considerados para o próximo mês. Produtos agregados, como são montados de acordo com ações/fiis não podem ser encerrados, exceto se todas as ações/fiis daquela instituição forem removidas na área de ações.
   - Produtos encerrados em abril continuam estando ativos nos meses anteriores, só passam a ser considerados encerrados para os meses seguintes. 
   - É possível, através do filtro, listar os produtos encerrados e voltar a te-los ativos. A reativação só é possível no mês em que o produto foi encerrado.

   ## Como valores de produtos agregados são atualizados:
      - O preço atual das ações é atualizado em 3 momentos:
      - Quando o usuário entra no site pela primeira vez no dia, em background;
      - Quando se passa 15 minutos da última atualização e ele entra na área ações, em background.
      - Quando ele clica explicitamente no botão de atualizar ações, com barra de progresso.

      - Caso não consiga recuperar o valor das ações/fiis do Yahoo Finance, o sistema registra uma mensagem de alerta (sininho fica em vermelho com o número 1 ou mensagem +1). Se conseguir, atualiza os valores individuais de cada ação. 

      - Sempre que a funcionalidade de recuperar as ações é finalizada os valores dos produtos agregados são atualizados com o novo valor calculado.


---


# AÇÕES
   - Ações não são registradas mês a mês — há um único conjunto de ações que se perpetua. A área /acoes exibe sempre a carteira atual do usuário.
   - Os campos de ação são: Ticker, Quantidade, Preço médio de compra.
   - Será possível dar refresh que irá atualizar os dados das ações com os valores mais recentes do yahoo finance. Depois de atualizar as ações, o sistema vai agrupar as ações por instituição e gravar como produtos agregados do mes atual o valor final ("Ações Clear")
   - Ao editar, incluir ou remover uma ação o sistema deve recalcular o agregado imediatamente (usando o preço atual já em cache, sem consultar o Yahoo Finance novamente) e atualizar o agregado em produtos.

---

## CLASSE DE ATIVOS
   - Existem  duas classes de ativos especiais: Ações e FIIs (Fundos Imobiliários). Elas terão uma flag isAcao que, quando verdadeira, o sistema terá comportamentos diferentes em relação às demais classes de ativos. Serão consideradas como Classes de Ativos de sistema e por isso não poderão ser removidas na área Classe de Ativos.