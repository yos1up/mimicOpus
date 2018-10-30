CREATE TABLE questions (id SERIAL, notes JSON, bpm REAL, uid INTEGER, title TEXT, uploadedAt TIMESTAMP, rating REAL);
CREATE TABLE scores (id SERIAL, qid INTEGER, uid INTEGER, score REAL);
CREATE TABLE users (id SERIAL, provider TEXT, idByProvider TEXT, username TEXT, photoURL TEXT, totalscore INTEGER, rating REAL);
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

\copy users FROM './default_sql_tables/users.csv' (FORMAT CSV, HEADER true);
\copy questions FROM './default_sql_tables/questions.csv' (FORMAT CSV, HEADER true);
