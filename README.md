<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Installation

```bash
$ npm install
```

## Environment variables required

```bash
ENABLE_SWAGGER - To see the endpoint documentation
APP_PORT - Main port where the app will run

DataBase Information
DB_USER
DB_PASSWORD
DB_PORT
DB_NAME
DB_HOST
DB_SYNC - Boolean - Use with care or do not use in production
DB_LOGGING - Boolean - More verbose logging for the DB queries
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

##Swagger 

When the swagger env flag is active, to see API documentation, access to ``/swagger`` in the browser.