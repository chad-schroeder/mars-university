const bcrypt = require('bcrypt');
const db = require('./db');
const { BCRYPT_WORK_ROUNDS } = require('./config');

// Database DDL
const DDL = `
  DROP TABLE IF EXISTS students_courses;
  DROP TABLE IF EXISTS courses;
  DROP TABLE IF EXISTS students;
  DROP TABLE IF EXISTS faculty;
  DROP TABLE IF EXISTS sections;
  DROP TABLE IF EXISTS species;
  
  CREATE TABLE species(
    id integer PRIMARY KEY,
    name text NOT NULL UNIQUE
  );

  CREATE TABLE students(
    id serial PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text,
    middle_name text,
    avatar text DEFAULT NULL,
    species_id integer DEFAULT 1 REFERENCES species (id),
    last_login_at timestamp without time zone
  );

  CREATE TABLE faculty(
    id serial PRIMARY KEY,
    first_name text NOT NULL,
    middle_name text,
    last_name text DEFAULT 'N/A',
    species_id integer DEFAULT 1 REFERENCES species (id),
    avatar text DEFAULT null
  );

  CREATE TABLE sections(
    code varchar(5) PRIMARY KEY,
    name text NOT NULL UNIQUE
  );

  CREATE TABLE courses(
    id serial PRIMARY KEY,
    title text NOT NULL,
    description text,
    section_code varchar(5) REFERENCES sections (code),
    credits integer NOT NULL
  );

  CREATE TABLE students_courses(
    id serial PRIMARY KEY,
    student_id integer REFERENCES students (id),
    course_id integer REFERENCES courses (id)
  );

  INSERT INTO species (id, name) VALUES (0, 'Indeterminate');
  INSERT INTO species (id, name) VALUES (1, 1);
  INSERT INTO species (id, name) VALUES (2, 'Mutant Human');
  INSERT INTO species (id, name) VALUES (3, 3);
  INSERT INTO species (id, name) VALUES (4, 'Decapodian');
  INSERT INTO species (id, name) VALUES (5, 'Neptunian');
  INSERT INTO species (id, name) VALUES (6, 'Monkey');
  INSERT INTO species (id, name) VALUES (7, 'Toad');
  INSERT INTO species (id, name) VALUES (8, 'Amphibiosan');
  INSERT INTO species (id, name) VALUES (9, 'Omicronian');
  INSERT INTO species (id, name) VALUES (10, 'Nibblonian');

  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('John', 'A.', 'Zoidberg', 4, 'zoidberg');
  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('Zapp', '', 'Brannigan', 1, 'zapp');
  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('Ogden', '', 'Wernstrom', 1, 'wernstrom');
  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('William', '', 'Shatner', 1, 'shatner');
  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('Leonard', '', 'Nimoy', 1, 'nimoy');
  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('Beelzebot', '', '', 3, 'beelzebot');
  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('Richard', 'M.', 'Nixon', 1, 'nixon');
  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('Morbo', '', '', 0, 'morbo');
  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('Lrrr', '', '', 9, 'lrrr');
  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('Hubert', 'J.', 'Farnsworth', 1, 'farnsworth');
  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('Calculon', '', '', 3, 'calculon');
  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('Hedonismbot', '', '', 3, 'hedonismbot');
  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('Bender', 'Bending', 'Rodriguez', 3, 'bender');
  INSERT INTO faculty (first_name, middle_name, last_name, species_id, avatar) VALUES ('Hermes', '', 'Conrad', 1, 'hermes');

  INSERT INTO sections (code, name) VALUES ('polit', 'politics');
  INSERT INTO sections (code, name) VALUES ('histo', 'history');
  INSERT INTO sections (code, name) VALUES ('robot', 'robotics');

  INSERT INTO courses (title, description, section_code, credits) VALUES ('Robotic Freedom Movement', 'Robotic Freedom Movement', 'robot', 300);
  INSERT INTO courses (title, description, section_code, credits) VALUES ('Interplanetary Bombardment', 'Interplanetary Bombardment', 'polit', 400);
  INSERT INTO courses (title, description, section_code, credits) VALUES ('The 20th Century', 'Learn about events that shaped Earth''s modern day', 'histo', 300);
`;

async function seedData() {
  try {
    // populate tables
    await db.query(DDL);

    // generate students

    // generate a hashed password
    const hashedPassword = await bcrypt.hash('fry', BCRYPT_WORK_ROUNDS);

    // push 'fry' student to the database
    await db.query(
      `INSERT INTO students (password, first_name, middle_name, last_name, avatar, last_login_at)
                  VALUES ($1, 'Philip', 'J', 'Fry', 'fry', current_timestamp)`,
      [hashedPassword]
    );
  } catch (err) {
    console.log('Something went wrong!', err);
    process.exit(1);
  }
}

seedData().then(() => {
  console.log('Successful seed!');
  process.exit();
});
