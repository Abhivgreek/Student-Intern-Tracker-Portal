
# 🌟 **Student Internship Tracker Portal**

A **web-based portal** designed to help students and institutions manage and track **internship applications**, **statuses**, and **feedback**. This system provides an easy-to-use interface for students to apply for internships and for organizations to manage their internship applications.

---

## 📋 **Features**

- **Student Registration & Login**: Students can **register**, **log in**, and manage their profile.
- **Internship Application Management**: Students can **apply** for internships and track their application status.
- **Internship Dashboard**: View a list of available internships, along with detailed information about each.
- **Admin Panel**: Admins can manage internship listings, view applications, and **approve/reject** applicants.
- **Feedback System**: Allows students and admins to provide feedback on internships and internship providers.
- **Responsive Design**: The portal is **fully responsive**, adapting seamlessly to mobile, tablet, and desktop devices.

---

## ⚙️ **Tech Stack**

- **Frontend**:
  - HTML, CSS, JavaScript, Bootstrap
- **Backend**:
  - Node.js, Express
- **Database**:
  - MySQL
- **Authentication**:
  - JWT (JSON Web Token) for secure user login
- **Version Control**:
  - Git, GitHub

---

## 🚀 **Setup Instructions**

To get started with the project locally, follow the steps below:

### **Prerequisites**

- **Node.js** (v14 or higher)
- **MySQL** Database

### **Set up the MySQL database**

1. Create a database in MySQL:

   ```bash
   mysql -u root -p
   CREATE DATABASE internship_db;
   ```

2. Update your `config.js` (or similar file) in the backend with your database details:

   ```js
   module.exports = {
     db: {
       host: 'localhost',
       user: 'root',
       password: 'mysql client password (default: "root")',
       database: 'internship_db',
     }
   };
   ```

### **Installation (via terminal)**

1. Initialize the project:

   ```bash
   npm init
   ```

2. Install required dependencies:

   ```bash
   npm install mysql express
   ```

### **Run the Application**

1. Start the server:

   ```bash
   node server.js
   ```

   Or, if you have `nodemon` installed:

   ```bash
   nodemon server.js
   ```

---

## 💼 **Conclusion**

The **Student Internship Tracker Portal** allows seamless management of internship applications for both students and administrators. It’s built using modern technologies and offers the flexibility to expand with new features.

---

### ✨ **Contributions**:
We welcome contributions to improve this project! If you’d like to contribute:
1. Fork the repository.
2. Clone your fork.
3. Create a new branch (`git checkout -b feature-name`).
4. Make your changes.
5. Commit and push your changes.
6. Open a pull request with a description of your changes.

---

### 📝 **License**:

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### 🔗 **Contact**:

For questions or suggestions, feel free to reach out through [GitHub Issues](https://github.com/Abhivgreek/Student-Intern-Tracker-Portal/issues).

---

### 💬 **Thanks for checking out the project!** 🚀
