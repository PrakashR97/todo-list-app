CREATE TABLE todos(
id VARCHAR(255) PRIMARY KEY,
user_email VARCHAR(255),
title VARCHAR(30),
progress INT,
DATE VARCHAR(300));


CREATE TABLE users(
email VARCHAR(255) PRIMARY KEY,
hashed_password VARCHAR(255));



INSERT INTO todos(id,user_email,title,progress,DATE)
VALUES('0','prakashr97@test.com','First todo',10,'Thu Jan 27 2023 13:25:45 (Gulf Standard Time)');
