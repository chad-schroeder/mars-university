DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

CREATE TABLE students(
  id serial PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  first_name text NOT NULL,
  last_name text,
  avatar text DEFAULT NULL,
  last_login_at timestamp without time zone
);

CREATE TABLE courses(
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text,
  status text NOT NULL
);