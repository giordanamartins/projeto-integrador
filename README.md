# Projeto Integrador

## 📝 Descrição

Este repositório refere-se ao **Projeto Integrador** das disciplinas de **Programação II**, **Banco de Dados** e **Engenharia de Software** do curso de **Ciência da Computação**. O objetivo do projeto é desenvolver uma **aplicação web** completa, aplicando os conceitos das 3 disciplinas

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- Axios
- Tailwind CSS

## 🏗️ Estrutura do Repositório

O projeto está organizado da seguinte forma:

/projeto-integrador

├── app/ Contém os códigos da aplicação

│ ├── backend/ Código do servidor 

│ └── frontend/ Interface da aplicação

├── docs/ Documentação do projeto

└── README.md Informações básicas sobre o projeto

### 📁 app/backend/
Irá conter a lógica de negócio e a API da aplicação:
- Configuração do servidor com Express.
- Conexão com PostgreSQL.
- Rotas, controladores e modelos.
- Autenticação e regras de negócio.

### 📁 app/frontend/
Contém a interface do usuário:
- Estrutura HTML.
- Estilização com Tailwind CSS.
- Scripts JS para interação com a API.

### 📁 docs/
Documentação relacionada ao projeto:
- Documento de requisitos do usuário.
- Documentação referente os modelos conceitual, relacional e físico do banco de dados.

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/giordanamartins/projeto-integrador.git

cd projeto-integrador
```

### 2. Instale as dependências
   
```bash
npm install
```

### 3. Configure o banco de dados
Você precisa ter o PostgreSQL instalado.
```bash
createdb projeto_integrador
```

### 4. Execute o script de criação
Localize o scrpit SQL acessando: docs > modelo físico e execute-o:

```bash
psql -U seu_usuario -d projeto_integrador -f modeloFisico.sql
```

### 5. Execute o script de criação
Crie o arquivo .env na raiz do projeto com o conteúdo:
```bash
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=projeto_integrador
DB_HOST=localhost
DB_PORT=5432
```

### 6. Inicie o servidor
```bash
npm run dev
```

---

### 👥 Desenvolvedores

Feito com 💻 e ☕ por:

- **Giordana Martins** – Matrícula: 2311100018 – [@giordanamartins](https://github.com/giordanamartins)  
- **Everton Althaus** – Matrícula: 2311100068 – [@Everton312](https://github.com/Everton312)

---
