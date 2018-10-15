CREATE TABLE questions (id SERIAL, notes JSON, bpm REAL, uid INTEGER, title TEXT, uploadedAt TIMESTAMP, rating REAL);
CREATE TABLE scores (id SERIAL, qid INTEGER, uid INTEGER, score REAL);
CREATE TABLE users (id SERIAL, provider TEXT, idByProvider TEXT, username TEXT, photoURL TEXT, totalscore INTEGER, rating REAL);

GRANT SELECT, INSERT, DELETE, UPDATE ON questions TO mimicopus;
GRANT USAGE, SELECT ON SEQUENCE questions_id_seq TO mimicopus;
GRANT SELECT, INSERT, DELETE ON scores TO mimicopus;
GRANT USAGE, SELECT ON SEQUENCE scores_id_seq TO mimicopus;
GRANT SELECT, INSERT, DELETE, UPDATE ON users TO mimicopus;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO mimicopus;
