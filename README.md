This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## PostgreSQL Setup

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
postgres=> CREATE TABLE questions (id SERIAL, notes JSON, bpm REAL, uid TEXT, userName TEXT, title TEXT, uploadedAt TIMESTAMP);
postgres=> CREATE TABLE scores (id SERIAL, qid INTEGER, uid INTEGER, score REAL);
```

grant (dev)
```
postgres=> GRANT SELECT, INSERT, DELETE ON questions TO mimicopus;
postgres=> GRANT USAGE, SELECT ON SEQUENCE questions_id_seq TO mimicopus;
postgres=> GRANT SELECT, INSERT, DELETE ON scores TO mimicopus;
postgres=> GRANT USAGE, SELECT ON SEQUENCE scores_id_seq TO mimicopus;
```

## Available Scripts

In the project directory, you can run:

### develop server
`npm run dev`

### deploy
push to heroku repository.
