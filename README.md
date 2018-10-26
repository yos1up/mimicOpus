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

setup for heroku
```
$ heroku pg:psql --app mimicopus-stg < mimicopus.sql
```

reset setup for heroku
```
$ heroku pg:psql --app mimicopus-stg < drop_mimicopus.sql
$ heroku pg:psql --app mimicopus-stg < mimicopus.sql
```

## Available Scripts

In the project directory, you can run:

### develop server
`npm run dev`

### deploy
`npm run build` and push to heroku repository.
