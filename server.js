const express = require("express")
const mysql = require("mysql2")
const bodyParser = require("body-parser")
const path = require("path")

const app = express()

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")))

// Parse JSON request bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cdac",
  database: "internship_db",
})

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err)
    throw err
  }
  console.log("MySQL Connected")

  // Create tables if not exists
  createTables()
})

function createTables() {
  // Create users table
  db.query(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(100)
    )
  `,
    (err) => {
      if (err) console.error("Error creating users table:", err)
      else console.log("Users table ready")
    },
  )

  // Create internships table
  db.query(
    `
    CREATE TABLE IF NOT EXISTS internships (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      name VARCHAR(100),
      email VARCHAR(100),
      company VARCHAR(100),
      role VARCHAR(100),
      start_date DATE,
      end_date DATE,
      status VARCHAR(20) DEFAULT 'Active',
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `,
    (err) => {
      if (err) console.error("Error creating internships table:", err)
      else console.log("Internships table ready")
    },
  )

  // Drop and recreate feedback table with correct columns
  db.query(`DROP TABLE IF EXISTS feedback`, (err) => {
    if (err) console.error("Error dropping feedback table:", err)

    // Create feedback table with all required columns
    db.query(
      `
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        type VARCHAR(50),
        message TEXT,
        rating INT,
        allow_contact BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (err) => {
        if (err) console.error("Error creating feedback table:", err)
        else console.log("Feedback table ready")
      },
    )
  })

  // Create contact table
  db.query(
    `
    CREATE TABLE IF NOT EXISTS contact (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100),
      subject VARCHAR(200),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) console.error("Error creating contact table:", err)
      else console.log("Contact table ready")
    },
  )
}

// API endpoints for internships
app.get("/api/internships", (req, res) => {
  const userId = req.query.userId

  if (!userId) {
    return res.status(401).json({ message: "User ID required" })
  }

  db.query("SELECT * FROM internships WHERE user_id = ?", [userId], (err, results) => {
    if (err) {
      console.error("Error fetching internships:", err)
      return res.status(500).json({ error: err.message })
    }
    res.json(results)
  })
})

app.post("/api/internships", (req, res) => {
  const { userId, name, email, company, role, start_date, end_date, status } = req.body

  if (!userId) {
    return res.status(401).json({ message: "User ID required" })
  }

  console.log("Adding internship:", req.body)

  db.query(
    "INSERT INTO internships (user_id, name, email, company, role, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [userId, name, email, company, role, start_date, end_date, status || "Active"],
    (err, result) => {
      if (err) {
        console.error("Error adding internship:", err)
        return res.status(500).json({ error: err.message })
      }
      res.status(201).json({ id: result.insertId, message: "Internship added successfully" })
    },
  )
})

app.put("/api/internships/:id", (req, res) => {
  const { name, email, company, role, start_date, end_date, status } = req.body
  const id = req.params.id

  console.log("Updating internship:", id, req.body)

  const sql =
    "UPDATE internships SET name = ?, email = ?, company = ?, role = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?"

  db.query(sql, [name, email, company, role, start_date, end_date, status, id], (err, result) => {
    if (err) {
      console.error("Error updating internship:", err)
      return res.status(500).json({ error: err.message })
    }
    res.json({ message: "Internship updated successfully" })
  })
})

// Update just the status of an internship
app.put("/api/internships/:id/status", (req, res) => {
  const { status } = req.body
  const id = req.params.id

  console.log("Updating internship status:", id, status)

  db.query("UPDATE internships SET status = ? WHERE id = ?", [status, id], (err, result) => {
    if (err) {
      console.error("Error updating internship status:", err)
      return res.status(500).json({ error: err.message })
    }
    res.json({ message: "Status updated successfully" })
  })
})

app.delete("/api/internships/:id", (req, res) => {
  const id = req.params.id

  console.log("Deleting internship:", id)

  db.query("DELETE FROM internships WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting internship:", err)
      return res.status(500).json({ error: err.message })
    }
    res.json({ message: "Internship deleted successfully" })
  })
})

// API endpoints for feedback

// GET all feedback messages
app.get("/api/feedback", (req, res) => {
  db.query("SELECT * FROM feedback ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("Error fetching feedback:", err)
      return res.status(500).json({ error: err.message })
    }
    res.json(results)
  })
})

// POST a new feedback
app.post("/submit-feedback", (req, res) => {
  const { name, email, type, message, rating, permission } = req.body
  const allowContact = permission === "on" ? 1 : 0

  const query = "INSERT INTO feedback (name, email, type, message, rating, allow_contact) VALUES (?, ?, ?, ?, ?, ?)"
  db.query(query, [name, email, type, message, rating, allowContact], (err, result) => {
    if (err) {
      console.error("Error inserting feedback:", err)
      return res.status(500).json({ error: "Something went wrong" })
    }
    res.status(201).json({ message: "Feedback submitted successfully" })
  })
})

// API endpoints for contact messages
app.get("/api/contact", (req, res) => {
  db.query("SELECT * FROM contact ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("Error fetching contact messages:", err)
      return res.status(500).json({ error: err.message })
    }
    res.json(results)
  })
})

app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body

  const query = "INSERT INTO contact (name, email, subject, message) VALUES (?, ?, ?, ?)"
  db.query(query, [name, email, subject, message], (err, result) => {
    if (err) {
      console.error("Error inserting contact message:", err)
      return res.status(500).json({ error: "Something went wrong" })
    }
    res.status(201).json({ message: "Message submitted successfully" })
  })
})

// API endpoints for authentication
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body

  console.log("Registering user:", name, email)

  // Check if user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Error checking user:", err)
      return res.status(500).json({ error: err.message })
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Insert new user
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password], // Note: In a real app, you should hash the password
      (err, result) => {
        if (err) {
          console.error("Error registering user:", err)
          return res.status(500).json({ error: err.message })
        }

        // Get the inserted user ID
        const userId = result.insertId

        res.status(201).json({
          message: "User registered successfully",
          user: { id: userId, name, email },
        })
      },
    )
  })
})

app.post("/api/login", (req, res) => {
  const { email, password } = req.body

  console.log("Login attempt:", email)

  db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, results) => {
    if (err) {
      console.error("Error during login:", err)
      return res.status(500).json({ error: err.message })
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // In a real app, you would create a session or JWT token here
    res.status(200).json({
      message: "Login successful",
      user: {
        id: results[0].id,
        name: results[0].name,
        email: results[0].email,
      },
    })
  })
})

// Serve HTML files for specific routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"))
})

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"))
})

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"))
})

app.get("/feedback", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "feedback.html"))
})

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"))
})

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"))
})

// Admin pages for viewing feedback and contact messages
app.get("/admin/feedback", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin-feedback.html"))
})

app.get("/admin/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin-contact.html"))
})

// Fallback route - serve index.html for any other routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
