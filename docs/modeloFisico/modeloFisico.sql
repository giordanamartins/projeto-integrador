CREATE TABLE clientes (
  codigo SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  cpf_cnpj VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  data_nascimento DATE NOT NULL,
  comentario TEXT,
  tipo_pessoa VARCHAR(1) NOT NULL,
  telefone1 VARCHAR(20) NOT NULL,
  telefone2 VARCHAR(20),
  endereco_logradouro VARCHAR(100),
  endereco_numero VARCHAR(10),
  endereco_complemento VARCHAR(50),
  endereco_bairro VARCHAR(50),
  endereco_cidade VARCHAR(50),
  endereco_uf VARCHAR(2),
  endereco_cep VARCHAR(10)
);

CREATE TABLE usuarios (
  codigo SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo_usuario VARCHAR(1) NOT NULL,
  numero_oab VARCHAR(20)
);

CREATE TABLE categorias_processo (
  codigo SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL
);

CREATE TABLE modelos_contratos (
  codigo SERIAL PRIMARY KEY,
  implementacao_modelo TEXT NOT NULL
);

CREATE TABLE processos (
  codigo SERIAL PRIMARY KEY,
  descricao TEXT,
  comentarios TEXT,
  status VARCHAR(1) NOT NULL,
  cliente_codigo INTEGER NOT NULL,
  usuario_codigo INTEGER NOT NULL,
  categoria_codigo INTEGER NOT NULL,
  modelo_contrato_codigo INTEGER NOT NULL,
  CONSTRAINT fk_processo_cliente FOREIGN KEY (cliente_codigo) REFERENCES clientes (codigo),
  CONSTRAINT fk_processo_usuario FOREIGN KEY (usuario_codigo) REFERENCES usuarios (codigo),
  CONSTRAINT fk_processo_categoria FOREIGN KEY (categoria_codigo) REFERENCES categorias_processo (codigo),
  CONSTRAINT fk_processo_modelo FOREIGN KEY (modelo_contrato_codigo) REFERENCES modelos_contratos (codigo)
);

CREATE TABLE a_receber (
  codigo SERIAL PRIMARY KEY,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  descricao TEXT,
  recorrencia VARCHAR(20),
  cliente_codigo INTEGER NOT NULL,
  processo_codigo INTEGER NOT NULL,
  CONSTRAINT fk_receber_cliente FOREIGN KEY (cliente_codigo) REFERENCES clientes (codigo),
  CONSTRAINT fk_receber_processo FOREIGN KEY (processo_codigo) REFERENCES processos (codigo)
);

CREATE TABLE categorias_despesa (
  codigo SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL
);

CREATE TABLE a_pagar (
  codigo SERIAL PRIMARY KEY,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  descricao TEXT,
  categoria_codigo INTEGER NOT NULL,
  CONSTRAINT fk_pagar_categoria FOREIGN KEY (categoria_codigo) REFERENCES categorias_despesa (codigo)
);

CREATE TABLE tarefas (
  codigo SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  data_hora TIMESTAMP NOT NULL,
  usuario_codigo INTEGER NOT NULL,
  CONSTRAINT fk_tarefa_usuario FOREIGN KEY (usuario_codigo) REFERENCES usuarios (codigo)
);
