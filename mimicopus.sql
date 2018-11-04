CREATE TABLE questions (id SERIAL, notes JSON, bpm REAL, uid INTEGER, title TEXT, uploadedAt TIMESTAMP, rating REAL);
CREATE TABLE answers (id SERIAL, qid INTEGER, uid INTEGER, notes JSON, score REAL);
CREATE TABLE users (id SERIAL, provider TEXT, idByProvider TEXT, username TEXT, displayname TEXT, photoURL TEXT, totalscore INTEGER, rating REAL);
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
