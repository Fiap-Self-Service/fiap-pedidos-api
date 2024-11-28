Funcionalidade: Cadastro de pedido

Cenário: Cadastro de pedido com sucesso
  Dado que seja informado um pedido válido
  Quando o pedido for cadastrado
  Então o pedido é cadastrado com sucesso
  E o sistema retorna um ID válido para o pedido

Cenário: Buscar Pedidos
  Dado que um pedido seja cadastrado com sucesso
  Quando realizado a busca dos pedidos
  Então a requisição deve ser executada com sucesso
  E o sistema retorna a lista de pedidos

Cenário: Cadastro de pedido inválido
  Dado que seja informado um pedido inválido
  Quando o pedido for cadastrado
  Então uma exceção deve ser informada

Cenário: Atualizar status pedido
  Dado que um pedido seja cadastrado com sucesso
  Quando alterar o status do pedido
  Então a requisição deve ser executada com sucesso
