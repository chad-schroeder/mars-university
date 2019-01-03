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
    middle_name text DEFAULT NULL,
    last_name text DEFAULT NULL,
    department text NOT NULL,
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
  INSERT INTO species (id, name) VALUES (1, 'Human');
  INSERT INTO species (id, name) VALUES (2, 'Mutant Human');
  INSERT INTO species (id, name) VALUES (3, 'Robot');
  INSERT INTO species (id, name) VALUES (4, 'Decapodian');
  INSERT INTO species (id, name) VALUES (5, 'Neptunian');
  INSERT INTO species (id, name) VALUES (6, 'Monkey');
  INSERT INTO species (id, name) VALUES (7, 'Toad');
  INSERT INTO species (id, name) VALUES (8, 'Amphibiosan');
  INSERT INTO species (id, name) VALUES (9, 'Omicronian');
  INSERT INTO species (id, name) VALUES (10, 'Nibblonian');

  INSERT INTO faculty (first_name, middle_name, last_name, department, species_id, avatar) 
    VALUES ('Turanga', null, 'Leela', 'President', 2, 'leela'),
            ('John', 'A.', 'Zoidberg', 'Sciences', 4, 'zoidberg'),
            ('Zapp', null, 'Brannigan', 'Criminal Justice', 1, 'zapp'),
            ('Ogden', null, 'Wernstrom', 'Sciences', 1, 'wernstrom'),
            ('William', null, 'Shatner', 'Arts', 1, 'shatner'),
            ('Leonard', null, 'Nimoy', 'Arts', 1, 'nimoy'),
            ('Beelzebot', null, null, 'Sciences', 3, 'beelzebot'),
            ('Richard', 'M.', 'Nixon', 'Politics', 1, 'nixon'),
            ('Lrrr', null, null, 'Politics', 9, 'lrrr'),
            ('Hubert', 'J.', 'Farnsworth', 'Sciences', 1, 'farnsworth'),
            ('Calculon', null, null, 'Arts', 3, 'calculon'),
            ('Hedonismbot', null, null, 'Robotics', 3, 'hedonismbot'),
            ('Bender', 'Bending', 'Rodriguez', 'Robotics', 3, 'bender'),
            ('Hermes', null, 'Conrad', 'Business', 1, 'hermes'),
            ('Al', null, 'Gore', 'Sciences', 1, 'gore'),
            ('Hypnotoad', null, null, 'Supporting Staff', 7, 'hypnotoad'),
            ('Mom', null, null, 'Business', 1, 'mom'),
            ('URL', null, null, 'Criminal Justice', 3, 'url');

  INSERT INTO sections (code, name) VALUES ('polit', 'politics');
  INSERT INTO sections (code, name) VALUES ('histo', 'history');
  INSERT INTO sections (code, name) VALUES ('robot', 'robotics');

  INSERT INTO courses (title, description, section_code, credits) 
    VALUES ('Robotic Freedom Movement', 'Robotic Freedom Movement', 'robot', 300),
          ('Interplanetary Bombardment', 'Interplanetary Bombardment', 'polit', 400),
          ('The 20th Century', 'Learn about events that shaped Earth''s modern day', 'histo', 300);
`;

async function seedData() {
  try {
    // populate tables
    await db.query(DDL);

    // generate a hashed password for all students
    const hashedPassword = await bcrypt.hash('password', BCRYPT_WORK_ROUNDS);

    // add 'fry' student to the database
    await db.query(
      `INSERT INTO students (password, first_name, middle_name, last_name, avatar, species_id, last_login_at)
                  VALUES ($1, 'Philip', 'J', 'Fry', 'fry', 1, current_timestamp),
                         ($1, 'Amy', null, 'Wong', 'amy', 1, current_timestamp),
                         ($1, 'Brain', null, null, 'brain', 0, current_timestamp),
                         ($1, 'Ethan', 'Bubblegum', 'Tate', 'bubblegum', 1,current_timestamp),
                         ($1, 'Colleen', 'O.', 'Hallahan', 'colleen', 1, current_timestamp),
                         ($1, 'Cubert', 'J.', 'Farnsworth', 'cubert', 1, current_timestamp),
                         ($1, 'Fat-bot', null, null, 'fat', 3, current_timestamp),
                         ($1, 'Gunther', null, null, 'gunther', 6, current_timestamp),
                         ($1, 'Kif', null, 'Kroker', 'kif', 8, current_timestamp),
                         ($1, 'Malfunctioning Eddie', null, null, 'malfunctioning', 3, current_timestamp),
                         ($1, 'Morbo', null, null, 'morbo', 0, current_timestamp),
                         ($1, 'Nibbler', null, null, 'nibbler', 10, current_timestamp),
                         ($1, 'Scruffy', null, null, 'scruffy', 0, current_timestamp),
                         ($1, 'Bigfoot', null, null, 'bigfoot', 0, current_timestamp),
                         ($1, 'Countess', 'de la', 'Roca', 'countess', 3, current_timestamp),
                         ($1, 'Elzar', null, null, 'elzar', 5, current_timestamp),
                         ($1, 'iZac', null, null, 'izac', 3, current_timestamp),
                         ($1, 'Neutral', null, null, 'neutral', 1, current_timestamp),
                         ($1, 'Robot Fry', null, null, 'robo', 3, current_timestamp),
                         ($1, 'Walt', null, null, 'walt', 1, current_timestamp)`,
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
