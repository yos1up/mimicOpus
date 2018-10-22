CREATE TABLE questions (id SERIAL, notes JSON, bpm REAL, uid INTEGER, title TEXT, uploadedAt TIMESTAMP, rating REAL);
CREATE TABLE scores (id SERIAL, qid INTEGER, uid INTEGER, score REAL);
CREATE TABLE users (id SERIAL, provider TEXT, idByProvider TEXT, username TEXT, photoURL TEXT, totalscore INTEGER, rating REAL);
