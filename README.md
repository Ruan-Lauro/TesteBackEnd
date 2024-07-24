# Teste OLT Backend
Aplicação que ler os arquivos dados pela OLTs

## Pré-requisitos
- [Node.js](https://nodejs.org/en)
- IDE (Recomendamos [VsCode](https://code.visualstudio.com/))
- [Frontend](https://github.com/Ruan-Lauro/TesteFrontEnd)

## Instalação
Baixar o projeto:
```
git clone https://github.com/Ruan-Lauro/TesteBackEnd.git
```

Dentro da pasta do projeto, acesse a pasta API:
```
cd TesteBackEnd
```
Criar um container no Docker
```
docker-compose up -d
```

Instalar as dependências:
```
npm install
```

Executar o projeto:
```
npm start
```

### Acesso:
Para acessar a API: 
<a>http://localhost:5000</a> 

## Tecnologias utilizadas
- [Node.js](https://nodejs.org/en) - Ambiente de execução de código Javascript do lado do servidor.
- [Express](https://expressjs.com/pt-br/) - Framework para aplicativos web Node.js.
- [Typescript](https://www.typescriptlang.org/) - Superset JavaScript.
- [Prisma](https://www.prisma.io/?via=start&gad_source=1) - ORM para banco de dados.
- [Postgresql](https://github.com/Ruan-Lauro/TesteFrontEnd) - Banco de dados.

