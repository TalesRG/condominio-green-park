# Desafio Técnico Backend NodeJS

## 🛠️ Tecnologias utilizadas

- **[NestJS](https://nestjs.com/)**  
  Framework progressivo para construção de aplicações Node.js eficientes e escaláveis. Utiliza TypeScript por padrão, mas suporta também JavaScript puro.

- **[MySQL](https://www.mysql.com/)**  
  Banco de dados relacional utilizado para persistência dos dados.

- **[TypeORM](https://typeorm.io/)**  
  ORM que facilita a interação e manipulação dos dados no banco MySQL.

- **[Docker](https://www.docker.com/)**  
  Plataforma utilizada para gerenciamento e configuração simplificada do ambiente de desenvolvimento.

## Como Rodar o Projeto

### Pré-requisitos

Para rodar o projeto, é necessário ter os seguintes requisitos instalados:

- **Back-end:**
    - [Docker](https://docs.docker.com/get-docker/)
    - [Node.js](https://nodejs.org/en/download/)
    - [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

1. Certifique-se de que o Docker está instalado e em execução.
2. Crie um arquivo `.env` com base no `.env.example`:
```sh
   cp .env.example .env
   ```
- **`cp .env.example .env`**: Copia o arquivo de exemplo `.env.example` para `.env`, garantindo que todas as variáveis de ambiente necessárias estejam configuradas corretamente.

3. Instale as dependências do projeto:
```sh
   yarn install
   ```

4. Inicie o banco de dados com Docker:
```sh
   docker-compose up -d
   ```

5. Execute o projeto:
```sh
   yarn start
   ```