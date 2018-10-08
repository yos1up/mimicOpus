This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## PostgreSQL Setup

create user
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
```

grant
```
postgres=> GRANT SELECT ON questions TO mimicopus;
postgres=> GRANT INSERT ON questions TO mimicopus;
postgres=> GRANT DELETE ON questions TO mimicopus;
postgres=> GRANT USAGE, SELECT ON SEQUENCE questions_id_seq TO mimicopus;
```

## Available Scripts

In the project directory, you can run:

### develop server
`npm run dev-start`

### deploy
`npm run build`
and push to heroku repository.
