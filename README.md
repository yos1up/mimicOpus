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
$ psql mimicopus < default_questions.sql --variable=uid=<yos1up's uid>
```

reset setup for dev
```
$ psql mimicopus < drop_mimicopus.sql
$ psql mimicopus < mimicopus_dev.sql
$ psql mimicopus < default_questions.sql --variable=uid=<yos1up's uid>
```

setup for heroku
```
$ heroku pg:psql --app mimicopus-stg < mimicopus.sql
$ heroku pg:psql --app mimicopus-stg < default_questions.sql --variable=uid=<yos1up's uid>
```

reset setup for heroku
```
$ heroku pg:psql --app mimicopus-stg < drop_mimicopus.sql
$ heroku pg:psql --app mimicopus-stg < mimicopus.sql
$ heroku pg:psql --app mimicopus-stg < default_questions.sql --variable=uid=<yos1up's uid>
```

## Environment variable

We need below environment variables.

- MIMICOPUS_GOOGLE_CLIENT_ID You can get this in google cloud platform.
- MIMICOPUS_GOOGLE_CLIENT_SECRET You can get this in google cloud platform.
- MIMICOPUS_GOOGLE_CALLBACK Full url of `/auth/google/callback`

## Run

### develop server
`npm run dev`

### deploy
`npm run build` and push to heroku repository.
