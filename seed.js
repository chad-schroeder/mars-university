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
    username text NOT NULL UNIQUE,
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
    username text NOT NULL UNIQUE,
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

  INSERT INTO faculty (username, first_name, middle_name, last_name, department, species_id, avatar) 
    VALUES ('grand priestess', 'Grand Priestess', null, null, 'President', 8, 'grand'),
            ('inez', 'Inez', '', 'Wong', 'Board of Directors', 1, 'inez'),
            ('leo', 'Leo', '', 'Wong', 'Board of Directors', 1, 'leo'),
            ('robot elder', 'Robot Elder', null, null, 'Board of Directors', 3, 'elder'),
            ('countess', 'Countess', 'de la', 'Roca', 'Board of Directors', 3, 'countess'),
            ('scruffy', 'Scruffy', null, null, 'Support Staff', 0, 'scruffy'),
            ('hypnotoad', 'Hypnotoad', null, null, 'Support Staff', 7, 'hypnotoad'),
            ('farnsworth', 'Hubert', 'J.', 'Farnsworth', 'Sciences', 1, 'farnsworth'),
            ('bender', 'Bender', 'Bending', 'Rodriguez', 'Robotics', 3, 'bender'),
            ('zoidberg', 'John', 'A.', 'Zoidberg', 'Sciences', 4, 'zoidberg'),
            ('hermes', 'Hermes', null, 'Conrad', 'Business', 1, 'hermes'),
            ('calculon', 'Calculon', null, null, 'Arts', 3, 'calculon'),
            ('zapp', 'Zapp', null, 'Brannigan', 'Criminal Justice', 1, 'zapp'),
            ('wernstrom', 'Ogden', null, 'Wernstrom', 'Sciences', 1, 'wernstrom'),
            ('shatner', 'William', null, 'Shatner', 'Arts', 1, 'shatner'),
            ('nimoy', 'Leonard', null, 'Nimoy', 'Arts', 1, 'nimoy'),
            ('beelzebot', 'Beelzebot', null, null, 'Sciences', 3, 'beelzebot'),
            ('nixon', 'Richard', 'M.', 'Nixon', 'Politics', 1, 'nixon'),
            ('lrrr', 'Lrrr', null, null, 'Politics', 9, 'lrrr'),
            ('izac', 'iZac', null, null, 'Arts', 3, 'izac'),
            ('hedonismbot', 'Hedonismbot', null, null, 'Robotics', 3, 'hedonismbot'),
            ('gore', 'Al', null, 'Gore', 'Sciences', 1, 'gore'),
            ('mom', 'Mom', null, null, 'Business', 1, 'mom'),
            ('url', 'URL', null, null, 'Criminal Justice', 3, 'url');

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
      `INSERT INTO students (username, password, first_name, middle_name, last_name, avatar, species_id, last_login_at)
                  VALUES ('fry', $1, 'Philip', 'J', 'Fry', 'fry', 1, current_timestamp),
                         ('leela', $1, 'Turanga', null, 'Leela', 'leela', 2, current_timestamp),
                         ('amy', $1, 'Amy', null, 'Wong', 'amy', 1, current_timestamp),
                         ('ethan', $1, 'Ethan', 'Bubblegum', 'Tate', 'bubblegum', 1,current_timestamp),
                         ('kif', $1, 'Kif', null, 'Kroker', 'kif', 8, current_timestamp),
                         ('morbo', $1, 'Morbo', null, null, 'morbo', 0, current_timestamp),
                         ('nibbler', $1, 'Nibbler', null, null, 'nibbler', 10, current_timestamp),
                         ('colleen', $1, 'Colleen', 'O.', 'Hallahan', 'colleen', 1, current_timestamp),
                         ('cubert', $1, 'Cubert', 'J.', 'Farnsworth', 'cubert', 1, current_timestamp),
                         ('gunther', $1, 'Gunther', null, null, 'gunther', 6, current_timestamp),
                         ('lucy', $1, 'Lucy', '', 'Liu', 'lucy', 1, current_timestamp),
                         ('fat-bot', $1, 'Fat-bot', null, null, 'fat', 3, current_timestamp),
                         ('malfunctioning eddie', $1, 'Malfunctioning Eddie', null, null, 'malfunctioning', 3, current_timestamp),
                         ('brain', $1, 'Brain', null, null, 'brain', 0, current_timestamp),
                         ('jonathan', $1, 'Jonathan', '', 'Frakes', 'jonathan', 1, current_timestamp),
                         ('nichelle', $1, 'Nichelle', '', 'Nichols', 'nichelle', 1, current_timestamp),
                         ('george', $1, 'George', '', 'Takei', 'george', 1, current_timestamp),
                         ('roberto', $1, 'Roberto', null, null, 'roberto', 3, current_timestamp),
                         ('bigfoot', $1, 'Bigfoot', null, null, 'bigfoot', 0, current_timestamp),
                         ('elzar', $1, 'Elzar', null, null, 'elzar', 5, current_timestamp),
                         ('neutral', $1, 'Neutral', null, null, 'neutral', 1, current_timestamp),
                         ('robot fry', $1, 'Robot Fry', null, null, 'robo', 3, current_timestamp),
                         ('larry', $1, 'Larry', null, null, 'larry', 1, current_timestamp),
                         ('walt', $1, 'Walt', null, null, 'walt', 1, current_timestamp)`,
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
