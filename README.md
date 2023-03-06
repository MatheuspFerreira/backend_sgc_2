SGC - Backend

#### Instalar dependências
```sh
$ yarn
```

#### Executar
```sh
yarn start
```

#### Variáveis de ambiente

- Ver arquivo `.env.example` e preencher adequadamente as variáveis no arquivo .env. Note que os testes executam no ambiente configurado em `.env`, então muita cautela ao utilizar credenciais de produção!

#### Executar testes

```sh
$ yarn test
```
#### Executar containers (ver `docker-compose.yaml`)
```sh 
$ docker-compose up -d
```

#### Migrations

##### Criar uma nova migration

Obs: Criar a migration com um nome sugestivo do que ela faz.

```sh 
$ yarn typeorm migration:create -n {NOME DA MIGRATION}
```

#### Executar migrations
```sh 
$ yarn typeorm migration:run
```

#### Reverter migrations
```sh 
$ yarn typeorm migration:revert
```

