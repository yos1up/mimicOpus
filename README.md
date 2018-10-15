This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## PostgreSQL Setup

```
brew install postgresql
brew services start postgresql
psql -d postgres
```

create user (dev)
```
postgres=> CREATE ROLE mimicopus WITH LOGIN PASSWORD 'mimicopus';
```

setup for dev
```
postgres=> CREATE DATABASE mimicopus;
$ psql mimicopus < mimicopus_dev.sql
```

reset setup for dev
```
postgres=> DROP DATABASE mimicopus;
postgres=> CREATE DATABASE mimicopus;
$ psql mimicopus < mimicopus_dev.sql
```

create database
```
postgres=> CREATE DATABASE mimicopus;
```

## Available Scripts

In the project directory, you can run:

### develop server
`npm run dev`

### deploy
push to heroku repository.
