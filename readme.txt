-----------------------------------------------------------

STEP - 1   DATABASE CREATION ON MYSQL commandline


-- Create the database
CREATE DATABASE IF NOT EXISTS internship_db;
USE internship_db;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the internships table
CREATE TABLE IF NOT EXISTS internships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the contact table
CREATE TABLE IF NOT EXISTS contact (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100),
      subject VARCHAR(200),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


----------------------------------------------------------------------------------------------------

Installation On Terminal  (open new terminal) -
{  

npm init

npm i mysql2 
or 
npm i mysql

npm i express

}

RUN command for server-
node server.js

you can go on this link after this or else will show on terminal also
http://localhost:3000/index.html