// Authentication functionality for login and signup
document.addEventListener("DOMContentLoaded", () => {
  // Add class to body for background
  if (document.querySelector("body.login-page")) {
    document.body.classList.add("login-page")
  } else if (document.querySelector("body.signup-page")) {
    document.body.classList.add("signup-page")
  }

  // Toggle password visibility
  const togglePassword = document.getElementById("toggle-password")
  if (togglePassword) {
    togglePassword.addEventListener("click", function () {
      const passwordInput = document.getElementById("password")
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
      passwordInput.setAttribute("type", type)

      // Toggle eye icon
      const eyeIcon = this.querySelector("i")
      eyeIcon.classList.toggle("fa-eye")
      eyeIcon.classList.toggle("fa-eye-slash")
    })
  }

  // Login form submission
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (response.ok) {
          // Store user info in localStorage
          localStorage.setItem("user", JSON.stringify(data.user))

          // Redirect to dashboard
          window.location.href = "dashboard.html"
        } else {
          alert(data.message || "Login failed. Please check your credentials.")
        }
      } catch (error) {
        console.error("Login error:", error)
        alert("An error occurred during login. Please try again.")
      }
    })
  }

  // Signup form submission
  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value

      // Basic validation
      if (password !== confirmPassword) {
        alert("Passwords do not match!")
        return
      }

      if (password.length < 8) {
        alert("Password must be at least 8 characters long!")
        return
      }

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        })

        const data = await response.json()

        if (response.ok) {
          // Store user info in localStorage
          localStorage.setItem("user", JSON.stringify(data.user))

          alert("Registration successful! Redirecting to dashboard.")
          window.location.href = "dashboard.html"
        } else {
          alert(data.message || "Registration failed. Please try again.")
        }
      } catch (error) {
        console.error("Registration error:", error)
        alert("An error occurred during registration. Please try again.")
      }
    })
  }

  // Check if user is logged in and update all pages
  function checkAuth() {
    const user = JSON.parse(localStorage.getItem("user"))
    const authButtons = document.querySelector(".navbar .d-flex")

    if (user && authButtons) {
      // Replace login/signup buttons with user info and logout
      authButtons.innerHTML = `
                <div class="d-flex align-items-center">
                    <span class="text-white me-3">Welcome, ${user.name}</span>
                    <button class="logout-btn" id="logout-btn">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            `

      // Add logout functionality
      const logoutBtn = document.getElementById("logout-btn")
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.removeItem("user")
          window.location.href = "index.html"
        })
      }
    }
  }

  // Check authentication status on page load - IMPORTANT: This must run on all pages
  checkAuth()
})
