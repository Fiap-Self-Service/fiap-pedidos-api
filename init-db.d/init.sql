-- Criação dos bancos de dados
CREATE DATABASE IF NOT EXISTS `fiap-pedidos`;
CREATE DATABASE IF NOT EXISTS `fiap-produtos`;
CREATE DATABASE IF NOT EXISTS `fiap-clientes`;

-- Criação do usuário e concessão de permissões
CREATE USER IF NOT EXISTS 'fiap'@'%' IDENTIFIED BY 'fiap';

GRANT ALL PRIVILEGES ON `fiap-pedidos`.* TO 'fiap'@'%';
GRANT ALL PRIVILEGES ON `fiap-produtos`.* TO 'fiap'@'%';
GRANT ALL PRIVILEGES ON `fiap-clientes`.* TO 'fiap'@'%';

FLUSH PRIVILEGES;
