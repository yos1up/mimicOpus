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

create database
```
postgres=> CREATE DATABASE mimicopus;
```

create table
```
$ psql -d mimicopus
mimicopus=> CREATE TABLE questions (id SERIAL, notes JSON, bpm REAL, uid INTEGER, title TEXT, uploadedAt TIMESTAMP);
mimicopus=> CREATE TABLE scores (id SERIAL, qid INTEGER, uid INTEGER, score REAL);
mimicopus=> CREATE TABLE users (id SERIAL, provider TEXT, idByProvider TEXT, username TEXT, photoURL TEXT);
```

grant (dev)
```
mimicopus=> GRANT SELECT, INSERT, DELETE, UPDATE ON questions TO mimicopus;
mimicopus=> GRANT USAGE, SELECT ON SEQUENCE questions_id_seq TO mimicopus;
mimicopus=> GRANT SELECT, INSERT, DELETE ON scores TO mimicopus;
mimicopus=> GRANT USAGE, SELECT ON SEQUENCE scores_id_seq TO mimicopus;
mimicopus=> GRANT SELECT, INSERT, DELETE, UPDATE ON users TO mimicopus;
mimicopus=> GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO mimicopus;
```

## Available Scripts

In the project directory, you can run:

### develop server
`npm run dev`

### deploy
push to heroku repository.
