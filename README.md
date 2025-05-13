#Student Internship Tracker Portal
A web-based portal designed to help students and institutions manage and track internship applications, statuses, and feedback. This system provides an easy-to-use interface for students to apply for internships, and for organizations to manage their internship applications.

Features
Student Registration & Login: Students can register, log in, and manage their profile.

Internship Application Management: Students can apply for internships and track their application status.

Internship Dashboard: The dashboard shows a list of available internships and allows students to view internship details.

Admin Panel: Admins can manage internship listings, view applications, and approve or reject applicants.

Feedback System: Students and admins can provide feedback on internships and internship providers.

Responsive Design: The portal is fully responsive and works seamlessly across devices (mobile, tablet, desktop).

Tech Stack
Frontend: HTML, CSS, JavaScript, Bootstrap

Backend: Node.js, Express

Database: MySQL

Authentication: JWT (JSON Web Token) for secure user login

Version Control: Git, GitHub

Setup Instructions
To get started with the project locally, follow the steps below:

Prerequisites
Node.js (v14 or higher)
-------------------------------------------------------------------------------------
MySQL Database

3. Set up the MySQL database
Create a database in MySQL and configure the database connection in the backend:
mysql -u root -p
CREATE DATABASE internship_db;

Update your config.js (or similar file) in the backend with your database details:
module.exports = {
  db: {
    host: 'localhost',
    user: 'root',
    password: 'mysql client password(default-"root")',
    database: 'internship_db',
  }
};

INSTALLATION ON TERMINAL- 

npm init
npm i mysql
npm i express

RUN COMMAND -
node server.js
or
nodemon server.js


🚀 Conclusion:
This Student Internship Tracker Portal allows seamless management of internship applications for both students and administrators. It's built with modern technologies and is highly extensible for future features.
